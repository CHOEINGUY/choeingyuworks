/**
 * Cloudflare Worker 코드 (참고용)
 * 이 코드를 Cloudflare Dashboard의 Worker "Edit Code" 화면에 붙여넣으세요.
 */

export default {
    async fetch(request, env) {
        // 1. CORS 설정 (브라우저에서 요청 허용)
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*', // 실제 배포 시엔 'https://your-domain.com'으로 제한 추천
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-upload-token',
        };

        // Preflight 요청 처리 (OPTIONS)
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // 2. 오직 POST 요청만 처리 (파일 업로드)
        if (request.method === "POST") {
            try {
                // [SECURITY] 간단한 토큰 인증
                // Worker Settings -> Variables에 'UPLOAD_TOKEN'을 설정해야 합니다. (예: "secret-1234")
                const uploadToken = request.headers.get("x-upload-token");
                const validToken = env.UPLOAD_TOKEN;

                // 토큰이 설정되어 있는데, 요청에 없거나 틀리면 거부
                if (validToken && uploadToken !== validToken) {
                    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
                }

                // FormData 파싱
                const formData = await request.formData();
                const file = formData.get('file');

                if (!file) {
                    return new Response("No file uploaded", { status: 400, headers: corsHeaders });
                }

                // 3. 고유한 파일명 생성 (타임스탬프 + 랜덤)
                // 파일명에서 확장자 추출
                const originalName = file.name || "unknown";
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(2, 8);
                const newFilename = `${timestamp}-${randomStr}-${originalName}`;

                // 4. R2 버킷에 파일 저장 (Binding 사용)
                // 'MY_BUCKET'은 대시보드 Settings -> R2 Bucket Bindings에서 설정한 변수명이어야 함
                await env.MY_BUCKET.put(newFilename, file, {
                    httpMetadata: {
                        contentType: file.type, // 이미지 타입 등 메타데이터 보존
                    },
                });

                // 5. 공개 접근 URL 반환
                // PUBLIC_BUCKET_URL은 Worker의 Settings -> Variables에서 환경변수로 설정하거나
                // 직접 하드코딩해서 쓰세요. (예: https://pub-xxxx.r2.dev)
                const publicUrl = env.PUBLIC_BUCKET_URL
                    ? `${env.PUBLIC_BUCKET_URL}/${newFilename}`
                    : `https://pub-PLEASE-SET-THIS-IN-ENV-VARS.r2.dev/${newFilename}`;

                return new Response(JSON.stringify({ url: publicUrl }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });

            } catch (err) {
                return new Response(`Upload Failed: ${err.message}`, { status: 500, headers: corsHeaders });
            }
        }

        // 그 외 요청
        return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    },
};
