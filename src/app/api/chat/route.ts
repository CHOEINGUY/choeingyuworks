import { OpenAIEmbeddings } from '@langchain/openai';
import { pinecone } from '@/lib/pinecone';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { db } from '@/lib/firebase';
import { serverTimestamp, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { CohereClient } from 'cohere-ai';

// Models for Rotation
const GEMINI_MODELS = [
    'gemini-3-flash-preview', 
    'gemini-2.5-flash-lite', 
    'gemini-2.5-flash'
];

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
    console.log(`9. Calling AI Stream (Provider: ${provider || 'openai'})...`);
    
    let result;

    if (provider === 'gemini') {
        const google = createGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY, // Manual Key Usage
        });

        // --- Gemini Model Rotation Logic ---
        for (const modelName of GEMINI_MODELS) {
            try {
                console.log(`Attempting Gemini Model: ${modelName}`);
                result = await streamText({
                    model: google(modelName),
                    system: systemPrompt,
                    messages,
                    onFinish: async ({ text }) => {
                        try {
                            const sessionId = reqBody.sessionId || 'anonymous_session';
                            await setDoc(doc(db, 'chat_sessions', sessionId), {
                                sessionId: sessionId,
                                persona: reqBody.persona || 'professional',
                                model: modelName,
                                provider: 'gemini',
                                lastUpdated: serverTimestamp(),
                                messages: arrayUnion({
                                    role: 'user',
                                    content: question,
                                    timestamp: new Date().toISOString()
                                }, {
                                    role: 'assistant',
                                    content: text,
                                    timestamp: new Date().toISOString()
                                })
                            }, { merge: true });
                        } catch (err) {
                            console.error('Failed to log chat to Firebase:', err);
                        }
                    },
                });
                console.log(`✅ Success with ${modelName}`);
                break; // Success, exit loop
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : '';
                const isQuotaError = errorMessage.includes('429') || errorMessage.includes('Quota') || errorMessage.includes('RESOURCE_EXHAUSTED');
                if (isQuotaError) {
                    console.warn(`⚠️ Quota exceeded for ${modelName}, switching to next...`);
                    continue; // Try next model
                }
                throw error; // Other errors, crash
            }
        }
        if (!result) throw new Error('All Gemini models exhausted (Quota Exceeded)');
    } else {
        // --- OpenAI Default ---
        result = await streamText({
            model: openai('gpt-4o-mini'),
            system: systemPrompt,
            messages,
             onFinish: async ({ text }) => {
                try {
                    const sessionId = reqBody.sessionId || 'anonymous_session';
                    await setDoc(doc(db, 'chat_sessions', sessionId), {
                        sessionId: sessionId,
                        persona: reqBody.persona || 'professional',
                        model: 'gpt-4o-mini',
                        provider: 'openai',
                        lastUpdated: serverTimestamp(),
                        messages: arrayUnion({
                            role: 'user',
                            content: question,
                            timestamp: new Date().toISOString()
                        }, {
                            role: 'assistant',
                            content: text,
                            timestamp: new Date().toISOString()
                        })
                    }, { merge: true });
                } catch (err) {
                    console.error('Failed to log chat to Firebase:', err);
                }
            },
        });
    }

    // Return raw text stream for simplified manual client
    return new Response(result.textStream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });

  } catch (error) {
    console.error('❌ Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
