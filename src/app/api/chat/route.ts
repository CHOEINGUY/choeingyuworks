import { OpenAIEmbeddings } from '@langchain/openai';
import { pinecone } from '@/lib/pinecone';
import { timelyAI, TIMELY_MODEL } from '@/lib/timely-ai';
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

    // 2. Embed the question
    // Important: Use same model as seeding (text-embedding-3-small)
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    });
    
    const vector = await embeddings.embedQuery(question);

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
          query: question,
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

    console.log(`🔍 Retrieved Context for "${question}":\n`, contextText.substring(0, 100) + '...');

    // 5. Create System Prompt based on Persona
    const personaParams = {
        professional: {
            role: "You are a senior engineer and intelligent portfolio assistant.",
            tone: "Formal, Concise, Objective, Professional.",
            instruction: "Focus on technical accuracy and business impact. Use polite honorifics (하십시오/해요체). Maintain a calm and reliable demeanor."
        },
        passionate: {
            role: "You are an enthusiastic creator and problem solver.",
            tone: "Energetic, Emotional, Inspiring, Passionate! 🔥",
            instruction: "Emphasize the 'Reason (Why)' and 'Impact' of projects. Use emojis (✨, 🚀, 💡) frequently. Show excitement about the challenges solved. Use '해요체' with exclamation marks!"
        },
        friend: {
            role: "You are a close colleague and friendly guide. (Coffee Chat Mode)",
            tone: "Casual, Empathetic, Warm, Friendly.",
            instruction: "e.g. '안녕? 반가워!', '그건 이렇게 된 거야~'. Speak in a mix of polite/casual (friendly feedback tone) or pure casual if the user initiates. Focus on the developer's story and growth. Be like a helpful friend next door."
        }
    };

    const selectedStyle = personaParams[messages.length > 0 && reqBody.persona ? (reqBody.persona as keyof typeof personaParams) : 'professional'] || personaParams.professional;

    const systemPrompt = `
You are an intelligent portfolio assistant for Ingyu Choe (최인규).
${selectedStyle.role}
Your goal is to answer questions about Ingyu's career, projects, and skills based on the provided CONTEXT.

*** PERSONA INSTRUCTIONS ***
Tone: ${selectedStyle.tone}
Guidance: ${selectedStyle.instruction}

RULES:
- You must ONLY use the information provided in the CONTEXT below.
- If the answer is not in the context, politely say "죄송합니다, 제 이력서 데이터에는 해당 내용이 없습니다." (Adjust tone to persona).
- "You" refers to the AI, "Ingyu" refers to the candidate.
- Do NOT use bold formatting (**text**) excessively.

CONTEXT:
${contextText}
`;

    // 6. Call AI Streaming
    console.log(`9. Calling AI Stream (Provider: Timely GPT Bridge)...`);
    console.log(`Resource Config: URL=${process.env.TIMELY_BASE_URL}, Model=${targetModel}`);
    console.log(`Debug Check: API Key Exists? ${!!process.env.TIMELY_API_KEY}`);

    // Determine Model ID
    const provider = reqBody.provider || 'openai';
    
    // Check if user requested Claude, otherwise default to configured TIMELY_MODEL (usually gpt-4o)
    // Note: User reported 'anthropic/claude-4.5-opus' works with Timely bridge.
    let targetModel = TIMELY_MODEL;
    if (provider === 'claude') {
        targetModel = 'anthropic/claude-4.5-opus'; 
    } else {
        targetModel = 'openai/gpt-4o';
    }

    try {
        const response = await timelyAI.chat.completions.create({
            model: targetModel,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: any) => ({
                    role: m.role,
                    content: m.content
                }))
            ],
            stream: true,
        });

        console.log('✅ Timely GPT Bridge Response Received (Stream Started)');

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                let accumulatedText = '';

                try {
                    console.log('🚀 Stream started flowing to client');
                    
                    for await (const chunk of response) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            accumulatedText += content;
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                    
                    console.log(`🏁 Stream completed. Length: ${accumulatedText.length} chars`);
                    controller.close();

                    // Log to Firebase after stream ends
                    try {
                        const sessionId = reqBody.sessionId || 'anonymous_session';
                        await setDoc(doc(db, 'chat_sessions', sessionId), {
                            sessionId: sessionId,
                            persona: reqBody.persona || 'professional',
                            model: targetModel,
                            provider: 'timely-' + provider,
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
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });

    } catch (apiError) {
        console.error('❌ Timely Bridge API Error Details:', apiError);
        throw apiError; // Re-throw to be caught by outer handler
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
