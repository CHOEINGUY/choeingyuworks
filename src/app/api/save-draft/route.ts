import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function GET() {
    const filePath = path.join(process.cwd(), "job-applications", "cover-letter-draft.md");
    const raw = await readFile(filePath, "utf-8");
    // 헤더 제거 (--- 이후 본문만 추출)
    const body = raw.split(/\n---\n/).slice(1).join("\n---\n").trim();
    return NextResponse.json({ content: body });
}

export async function POST(req: NextRequest) {
    const { content } = await req.json();

    const filePath = path.join(process.cwd(), "job-applications", "cover-letter-draft.md");

    const fileContent = `# 커버레터 초안 (작성 중)

> 마지막 저장: ${new Date().toLocaleString("ko-KR")}
> 원칙: 문장은 100% 본인 작성. AI는 맞춤법·문법 교정만.

---

${content}
`;

    await writeFile(filePath, fileContent, "utf-8");

    return NextResponse.json({ ok: true });
}
