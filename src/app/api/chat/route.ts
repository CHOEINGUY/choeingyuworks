import { OpenAIEmbeddings } from '@langchain/openai';
import { pinecone } from '@/lib/pinecone';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Models for Rotation
const GEMINI_MODELS = [
    'gemini-3-flash-preview', 
    'gemini-2.5-flash-lite', 
    'gemini-2.5-flash'
];

// OpenAI streaming is Edge compatible, but LangChain/Pinecone might prefer Node env
// For simplicity in this RAG setup, we'll use Node runtime
export const runtime = 'nodejs'; 

export async function POST(req: Request) {
  try {
    const { messages, provider } = await req.json(); // provider: 'openai' | 'gemini'
    
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

    // 3. Query Pinecone
    const indexName = process.env.PINECONE_INDEX_NAME || 'resume-chatbot';
    const index = pinecone.Index(indexName);

    const queryResponse = await index.query({
      vector: vector,
      topK: 15, // Increased to 15 to handle mixed code/resume chunks
      includeMetadata: true,
    });

    // 4. Construct Context
    const contextText = queryResponse.matches
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((match) => (match.metadata as any).text)
      .join('\n\n---\n\n');

    console.log(`🔍 Retrieved Context for "${question}":\n`, contextText.substring(0, 100) + '...');

    // 5. Create System Prompt
    const systemPrompt = `
You are an intelligent portfolio assistant for Ingyu Choe (최인규).
Your goal is to answer questions about Ingyu's career, projects, and skills based on the provided CONTEXT.

RULES:
- You must ONLY use the information provided in the CONTEXT below.
- Prioritize "Resume Profile" and "Project Summary" type information for general questions about the candidate.
- If the answer is not in the context, politely say "죄송합니다, 제 이력서 데이터에는 해당 내용이 없습니다." or offer to contact via email.
- Be professional, enthusiastic, and concise.
- Speak in Korean primarily, unless the user asks in English.
- If asking about specific projects, mention the tech stack used.
- "You" refers to the AI, "Ingyu" refers to the candidate. But you represent Ingyu, so you can speak as a representative.
- Do NOT use bold formatting (**text**) effectively. Keep the text clean and plain unless emphasizing a list header.

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
                });
                console.log(`✅ Success with ${modelName}`);
                break; // Success, exit loop
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
                const isQuotaError = error.message?.includes('429') || error.message?.includes('Quota') || error.message?.includes('RESOURCE_EXHAUSTED');
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
