# CLAUDE.md

## RAG 챗봇 (`src/app/api/chat/route.ts`)

이력서/경력 관련 근황이 바뀌면 다음 두 가지를 같이 확인할 것:

1. **`src/features/resume/data/resumeData.ts`** — 이력서 페이지와 시딩 스크립트가 자동으로 읽는 소스.
2. **`knowledge-base/*.md`** — 수동 작성 파일. `resumeData.ts`를 고쳐도 여기는 자동 반영되지 않는다.
   근황(재직 상태, 직급, 담당 업무 등)이 바뀌면 관련 파일을 직접 갱신해야 챗봇이 답변에 반영한다.

AI provider/model이나 RAG 구조를 바꾸면 다음도 같이 확인할 것:

1. **`src/lib/deepseek.ts` / `src/app/api/chat/route.ts`** — 실제 런타임 provider와 model.
2. **`knowledge-base/chatbot_architecture.md`** — 챗봇이 자기 구조를 설명할 때 참고하는 최신 문서.
3. **`scripts/seed-db.ts`의 Self-Reflection 데이터** — 과거 provider/model명이 하드코딩되어 있지 않은지 확인.
4. 배포 환경의 필수 키(`DEEPSEEK_API_KEY`, `OPENAI_API_KEY`, `PINECONE_API_KEY`)가 Production/Preview에 들어 있는지 확인.

연결 진단은 다음으로 확인할 수 있다:

```bash
npx tsx scripts/test-connections.ts
```

수정 후에는 재시딩 필요:

```bash
npx tsx scripts/seed-db.ts
```

이 스크립트는 **프로덕션 Pinecone 인덱스를 전체 삭제 후 재구축**한다 (`index.deleteAll()`). 실행 전 사용자에게 확인받을 것 — 라이브 챗봇이 쓰는 인덱스이고 OpenAI 임베딩 비용도 실제로 발생한다.
