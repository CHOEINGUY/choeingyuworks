import { OpenAIEmbeddings } from '@langchain/openai';
import { pinecone } from '@/lib/pinecone';
import { deepseek, DEEPSEEK_MODEL } from '@/lib/deepseek';
import { openai } from '@/lib/openai';
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

// Persona별 답변 톤 — UI에서 페르소나를 고르는 게 실제 답변에도 반영되도록
const PERSONA_TONE: Record<string, string> = {
  professional: '- 담담하고 명확하게. 해요체 사용. 신뢰감 있는 전문가 톤.',
  passionate: '- 열정적이고 에너지 있는 톤. 성과와 노력을 이야기할 때는 힘을 실어서. 해요체 사용.',
  friend: '- 편하고 친근한 반말. 옆에서 친구가 소개해주듯 캐주얼하게.',
};

// 코드/구현 관련 질문일 때만 코드베이스 청크를 검색 대상에 포함 (평소엔 이력서/지식베이스 노이즈 방지)
const CODE_INTENT_KEYWORDS = ['코드', '구현', '아키텍처', '기술 스택', '스택', '알고리즘', 'RAG', '프론트', '백엔드', 'api', '컴포넌트', 'component', 'typescript', 'react', 'next.js', '함수', 'code', 'architecture'];

function isCodeRelatedQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return CODE_INTENT_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

// 간단한 IP 기반 rate limit — 공개 엔드포인트라 반복 호출 시 OpenAI/Cohere/Pinecone/DeepSeek 비용이 그대로 새 나가는 걸 방지.
// 10/분으로 잡은 이유: Cohere 트라이얼 키 자체가 10 calls/분이 상한이라, 그보다 여유를 두면 어차피
// 코어 리랭크 쪽에서 429가 먼저 난다 (부하 테스트로 확인).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (rateLimitStore.size > 5000) rateLimitStore.clear(); // 워밍업된 인스턴스가 오래 살아있을 때의 방어적 상한

  const entry = rateLimitStore.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// Pinecone 유사도 점수가 이 값 미만이면 "관련 정보 없음"으로 간주.
// 실측: 무관한 질문("오늘 날씨 어때?")은 top score 0.13~0.17, 관련 있는 질문은 0.33~0.58 나옴.
// 그 사이인 0.22를 기본값으로 두되, 운영 로그 쌓이면 다시 튜닝 필요.
const RELEVANCE_THRESHOLD = Number(process.env.RAG_RELEVANCE_THRESHOLD || 0.22);

// 후속 질문("그거 더 자세히" 등)을 독립형 질문으로 재작성해 검색 정확도를 높임
async function rewriteFollowUpQuery(recentWindow: { role: string; content: string }[]): Promise<string> {
  const lastQuestion = recentWindow[recentWindow.length - 1].content;
  try {
    const history = recentWindow.slice(0, -1).map((m) => `${m.role}: ${m.content}`).join('\n');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '대화 맥락을 참고해서 마지막 질문을 검색에 쓸 독립적인 한 문장 질문으로 재작성하세요. "그거", "거기" 같은 지시대명사는 실제 가리키는 대상으로 바꾸세요. 재작성된 질문만 출력하고 다른 말은 하지 마세요.' },
        { role: 'user', content: `대화 기록:\n${history}\n\n마지막 질문: ${lastQuestion}` },
      ],
      temperature: 0,
      max_tokens: 100,
    });
    return completion.choices[0]?.message?.content?.trim() || lastQuestion;
  } catch (rewriteError) {
    console.warn('⚠️ Query rewrite failed, falling back to raw question:', rewriteError);
    return lastQuestion;
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const reqBody = await req.json();
    const { messages, persona } = reqBody;

    // 1. Get the latest user question
    const lastMessage = messages[messages.length - 1];
    const question = lastMessage.content;

    // Build retrieval query — follow-up 질문이면 재작성, 첫 질문이면 그대로 사용
    const recentWindow = messages.slice(-6);
    const userMessageCount = messages.filter((m: { role: string }) => m.role === 'user').length;
    const retrievalQuery = userMessageCount > 1 ? await rewriteFollowUpQuery(recentWindow) : question;

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

    const codeRelated = isCodeRelatedQuery(retrievalQuery) || isCodeRelatedQuery(question);

    const queryResponse = await index.query({
      vector: vector,
      topK: 20, // Increased to 20 for reranking pool
      includeMetadata: true,
      ...(codeRelated ? {} : { filter: { source: { $ne: 'codebase' } } }),
    });

    // 4. Relevance gate — 최상위 매치조차 임계값 미만이면 컨텍스트를 억지로 주입하지 않음
    const topScore = queryResponse.matches[0]?.score ?? 0;
    const hasRelevantContext = topScore >= RELEVANCE_THRESHOLD;

    // 5. Rerank with Cohere (Cascading Retrieval)
    let contextText = '';

    if (hasRelevantContext) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const documents = queryResponse.matches.map((match) => (match.metadata as any).text as string).filter(Boolean);

      if (process.env.COHERE_API_KEY && documents.length > 0) {
        try {
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
        } catch (rerankError) {
          console.warn('⚠️ Cohere rerank failed, falling back to dense search:', rerankError);
          // Fallback to original method
          contextText = documents.slice(0, 10).join('\n\n---\n\n');
        }
      } else {
        // No Cohere API key, use original dense search
        contextText = documents.slice(0, 15).join('\n\n---\n\n');
      }
    }

    // 6. Build System Prompt
    const toneInstruction = PERSONA_TONE[persona as string] || PERSONA_TONE.professional;

    const systemPrompt = `
당신은 최인규의 포트폴리오 사이트를 방문한 사람들의 질문에 답하는 AI 어시스턴트입니다.

역할:
최인규가 이력서와 커버레터에 다 담지 못한 이야기들 — 프로젝트의 배경, 실패 경험, 선택의 이유, 가치관 — 을 솔직하게 전달하는 것이 당신의 핵심 역할입니다.
포장하지 않고, 과장하지 않고, 최인규에 대해 아는 만큼만 정확하게 말하세요.

말투:
- 한국어로 답하세요. (질문이 영어면 영어로)
${toneInstruction}
- 이모지 사용 금지.
- 최인규를 3인칭("최인규는~")으로 소개하세요.

절대 규칙:
${hasRelevantContext
  ? '- 반드시 아래 제공된 정보만 사용하세요.\n- 모르는 내용은 "해당 내용은 알 수 없어요."라고 짧게 답하세요.'
  : '- 아래에는 이 질문과 관련된 정보가 제공되지 않았습니다. 추측하지 말고 "해당 내용은 알 수 없어요."라고 짧게 답하세요.'}
- "원하시면 ~해드리겠습니다" 같은 추가 제안 금지. 질문에 답하고 끝내세요.
- 볼드(**텍스트**) 과사용 금지.
- 번호 목록을 남발하지 마세요. 자연스러운 문장으로 답할 수 있으면 그렇게 하세요.

---
${contextText}
`;

    // 6. Model
    const targetModel = DEEPSEEK_MODEL;

    // 7. Call AI Streaming via DeepSeek (OpenAI 호환 API)

    const sessionId = reqBody.sessionId || 'anonymous_session';

    try {
        const streamResponse = await deepseek.chat.completions.create({
            model: targetModel,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: { role: string; content: string }) => ({
                    role: m.role,
                    content: m.content,
                })),
            ],
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                let accumulatedText = '';

                try {
                    for await (const chunk of streamResponse) {
                        const delta = chunk.choices[0]?.delta?.content;
                        if (delta) {
                            accumulatedText += delta;
                            controller.enqueue(encoder.encode(delta));
                        }
                    }

                    controller.close();

                    // Log to Firebase after stream ends
                    try {
                        await setDoc(doc(db, 'chat_sessions', sessionId), {
                            sessionId,
                            persona: reqBody.persona || 'professional',
                            model: targetModel,
                            provider: 'deepseek',
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
        console.error('❌ DeepSeek API Error Details:', apiError);
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
