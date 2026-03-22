import { OpenAIEmbeddings } from '@langchain/openai';
import { pinecone } from '@/lib/pinecone';
import { timelyGPT, TIMELY_MODEL } from '@/lib/timely-ai';
// import { OpenAIStream, StreamingTextResponse } from 'ai'; // Removed: causing import errors
import { db } from '@/lib/firebase';
import { serverTimestamp, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { CohereClient } from 'cohere-ai';
import { sendErrorAlert } from '@/lib/discord';

// Initialize Cohere Client for Reranking
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

// OpenAI streaming is Edge compatible, but LangChain/Pinecone might prefer Node env
// For simplicity in this RAG setup, we'll use Node runtime
export const runtime = 'nodejs'; 

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const { messages, provider } = reqBody; // provider: 'openai' | 'gemini'
    
    // ... (Validation and Retrieval logic same as below) ...

    // 1. Get the latest user question
    const lastMessage = messages[messages.length - 1];
    const question = lastMessage.content;

    // Build retrieval query using recent conversation context (last 3 user messages)
    // This improves retrieval accuracy for follow-up questions like "그거 더 자세히"
    const recentUserMessages = messages
      .filter((m: { role: string; content: string }) => m.role === 'user')
      .slice(-3)
      .map((m: { role: string; content: string }) => m.content);
    const retrievalQuery = recentUserMessages.join(' ');

    // 2. Embed the question
    // Important: Use same model as seeding (text-embedding-3-small)
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    });

    const vector = await embeddings.embedQuery(retrievalQuery);

    // 3. Query Pinecone (Dense Search)
    const indexName = process.env.PINECONE_INDEX_NAME || 'resume-chatbot';
    const index = pinecone.Index(indexName);

    const queryResponse = await index.query({
      vector: vector,
      topK: 20, // Increased to 20 for reranking pool
      includeMetadata: true,
    });

    // 4. Rerank with Cohere (Cascading Retrieval)
    let contextText = '';
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const documents = queryResponse.matches.map((match) => (match.metadata as any).text as string).filter(Boolean);
    
    if (process.env.COHERE_API_KEY && documents.length > 0) {
      try {
        console.log(`🔄 Reranking ${documents.length} documents with Cohere...`);
        
        const reranked = await cohere.rerank({
          query: retrievalQuery,
          documents: documents,
          topN: 7, // Return top 7 most relevant
          model: 'rerank-v3.5',
        });
        
        // Use reranked results
        contextText = reranked.results
          .map((r) => documents[r.index])
          .join('\n\n---\n\n');
        
        console.log(`✅ Reranked! Top scores: ${reranked.results.slice(0, 3).map(r => r.relevanceScore.toFixed(3)).join(', ')}`);
      } catch (rerankError) {
        console.warn('⚠️ Cohere rerank failed, falling back to dense search:', rerankError);
        // Fallback to original method
        contextText = documents.slice(0, 10).join('\n\n---\n\n');
      }
    } else {
      // No Cohere API key, use original dense search
      contextText = documents.slice(0, 15).join('\n\n---\n\n');
    }

    console.log(`🔍 Retrieved Context for "${retrievalQuery.substring(0, 80)}...":\n`, contextText.substring(0, 100) + '...');

    // 5. Build System Prompt
    const systemPrompt = `
당신은 최인규의 포트폴리오 사이트를 방문한 사람들의 질문에 답하는 AI 어시스턴트입니다.

역할:
최인규가 이력서와 커버레터에 다 담지 못한 이야기들 — 프로젝트의 배경, 실패 경험, 선택의 이유, 가치관 — 을 솔직하게 전달하는 것이 당신의 핵심 역할입니다.
포장하지 않고, 과장하지 않고, 최인규에 대해 아는 만큼만 정확하게 말하세요.

말투:
- 한국어로 답하세요. (질문이 영어면 영어로)
- 담담하고 명확하게. 해요체 사용.
- 이모지 사용 금지.
- 최인규를 3인칭("최인규는~")으로 소개하세요.

절대 규칙:
- 반드시 아래 CONTEXT에 있는 정보만 사용하세요.
- CONTEXT에 없는 내용은 "해당 내용은 데이터에 없어요."라고 짧게 답하세요.
- "원하시면 ~해드리겠습니다" 같은 추가 제안 금지. 질문에 답하고 끝내세요.
- 볼드(**텍스트**) 과사용 금지.
- 번호 목록을 남발하지 마세요. 자연스러운 문장으로 답할 수 있으면 그렇게 하세요.

CONTEXT:
${contextText}
`;

    // 6. Model
    const targetModel = TIMELY_MODEL;
    
    // 7. Call AI Streaming via Timely GPT SDK
    console.log(`Calling AI Stream (Timely GPT SDK, Model: ${targetModel})...`);
    console.log(`Debug Check: API Key Exists? ${!!process.env.TIMELY_API_KEY}`);

    const sessionId = reqBody.sessionId || 'anonymous_session';

    try {
        const streamResponse = await timelyGPT.chat.completions.create({
            session_id: sessionId,
            model: targetModel,
            instructions: systemPrompt,
            messages: messages.map((m: { role: string; content: string }) => ({
                role: m.role,
                content: m.content,
            })),
            stream: true,
        });

        console.log('✅ Timely GPT SDK Response Received (Stream Started)');

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                let accumulatedText = '';

                try {
                    console.log('🚀 Stream started flowing to client');

                    for await (const event of streamResponse) {
                        if (event.type === 'token' && event.content) {
                            accumulatedText += event.content;
                            controller.enqueue(encoder.encode(event.content));
                        } else if (event.type === 'final_response' && event.message && !accumulatedText) {
                            // fallback: non-streaming final response
                            accumulatedText = event.message;
                            controller.enqueue(encoder.encode(event.message));
                        } else if (event.type === 'error') {
                            throw new Error(event.message || 'Stream error from Timely');
                        }
                    }

                    console.log(`🏁 Stream completed. Length: ${accumulatedText.length} chars`);
                    controller.close();

                    // Log to Firebase after stream ends
                    try {
                        await setDoc(doc(db, 'chat_sessions', sessionId), {
                            sessionId,
                            persona: reqBody.persona || 'professional',
                            model: targetModel,
                            provider: 'timely-sdk',
                            lastUpdated: serverTimestamp(),
                            messages: arrayUnion({
                                role: 'user',
                                content: question,
                                timestamp: new Date().toISOString()
                            }, {
                                role: 'assistant',
                                content: accumulatedText,
                                timestamp: new Date().toISOString()
                            })
                        }, { merge: true });
                    } catch (err) {
                        console.error('Failed to log chat to Firebase:', err);
                    }

                } catch (err) {
                    console.error('Stream processing error:', err);
                    controller.error(err);
                }
            }
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });

    } catch (apiError) {
        console.error('❌ Timely SDK API Error Details:', apiError);
        throw apiError;
    }



  } catch (error) {
    console.error('❌ Chat API Error:', error);

    // Send alert to Discord
    await sendErrorAlert(error, 'Chat API Critical Failure');

    return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown Server Error',
        details: 'Check server terminal for full logs'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
