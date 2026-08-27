# 포트폴리오 AI 챗봇 아키텍처 (현재 소스 기준)

이 문서는 포트폴리오 AI 챗봇 자체에 대한 질문에 답할 때 사용하는 최신 기술 정보다.
과거 시딩 데이터나 오래된 Self-Reflection 내용과 충돌하면 이 문서와 실제 런타임 설정을 우선한다.

## 현재 구성

- 최종 답변 생성: DeepSeek API
- 기본 답변 모델: `deepseek-v4-flash` (`DEEPSEEK_MODEL` 환경변수로 변경 가능)
- 응답 모드: non-thinking. 포트폴리오 Q&A는 복잡한 장기 추론보다 첫 응답 속도와 비용 효율이 중요하므로 thinking mode를 명시적으로 끈다.
- 후속 질문 재작성: OpenAI `gpt-4o-mini`
- 임베딩: OpenAI `text-embedding-3-small`
- 벡터 데이터베이스: Pinecone, 기본 인덱스 `resume-chatbot`
- 1차 검색: Pinecone dense search top 20
- 관련도 게이트: 기본 0.22 (`RAG_RELEVANCE_THRESHOLD`로 조정 가능)
- 리랭크: Cohere `rerank-v3.5`, top 7
- Cohere 장애/미설정 시: Pinecone dense search 결과로 fallback
- 대화 로그와 답변 피드백: Firebase Firestore
- API 장애 알림: Discord webhook
- 프론트엔드: Next.js + React 기반 스트리밍 채팅 UI

## 검색 정책

일반적인 경력·프로젝트·가치관 질문에서는 코드베이스 청크를 제외한다.
코드, 구현, 아키텍처, 기술 스택, API, React, Next.js 같은 기술 질문으로 판단되는 경우에만 코드베이스 청크를 검색 대상에 포함한다.

후속 질문은 최근 대화 문맥을 이용해 독립적인 검색 질문으로 재작성한 뒤 임베딩한다. 예를 들어 "그건 왜 그렇게 했어?" 같은 질문은 앞선 대화의 실제 대상을 포함하는 형태로 바꾼다.

## 운영 설정

필수 환경변수:

- `DEEPSEEK_API_KEY`
- `OPENAI_API_KEY`
- `PINECONE_API_KEY`

선택 환경변수:

- `DEEPSEEK_MODEL` (기본 `deepseek-v4-flash`)
- `PINECONE_INDEX_NAME` (기본 `resume-chatbot`)
- `RAG_RELEVANCE_THRESHOLD` (기본 `0.22`)
- `COHERE_API_KEY` (없으면 rerank 없이 dense search 사용)
- Firebase 관련 `NEXT_PUBLIC_FIREBASE_*`
- `DISCORD_WEBHOOK_URL`

## 과거 정보 주의

초기 챗봇 Self-Reflection 데이터에는 GPT-4o/Claude 또는 Timely GPT Bridge를 최종 답변 모델로 설명하는 과거 내용이 포함될 수 있다. 현재 최종 답변 생성 provider는 DeepSeek이며, 실제 런타임 모델 값이 가장 우선하는 정보다.
