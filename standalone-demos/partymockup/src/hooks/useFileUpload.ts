import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

// TODO: 1. Cloudflare Worker를 배포하고, 그 URL을 아래에 입력하세요.
// 예시: const WORKER_ENDPOINT = "https://upload-worker.your-name.workers.dev";
const WORKER_ENDPOINT = "https://image-uploader.chldlsrb07.workers.dev"; // <--- 여기에 Worker 주소 입력 필수!

// Compression Options
const COMPRESSION_OPTIONS = {
    maxSizeMB: 1,          // 1MB 이하로 압축
    maxWidthOrHeight: 1920, // 최대 1920px
    useWebWorker: true,    // 웹 워커 사용 (성능 향상)
    initialQuality: 0.7    // 초기 품질 70%
};

const UPLOAD_TOKEN = process.env.NEXT_PUBLIC_UPLOAD_TOKEN || ""; // [SECURITY] .env.local 파일에 NEXT_PUBLIC_UPLOAD_TOKEN 정의 필요

/**
 * Hook for handling file uploads to Cloudflare R2 via Worker
 */
export const useFileUpload = () => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<any>(null);

    const upload = async (file: File, options?: { skipCompression?: boolean }) => {
        if (!file) {
            setError("No file provided");
            return Promise.reject("No file provided");
        }

        if (!WORKER_ENDPOINT) {
            toast.error("개발자 설정 필요: Cloudflare Worker URL이 설정되지 않았습니다. (useFileUpload.js 확인)");
            return Promise.reject("Worker URL missing");
        }

        setIsUploading(true);
        setError(null);
        setProgress(10); // 시작 시각적 피드백

        try {
            let processedFile = file;

            // [COMPRESSION] If it's an image AND compression is not skipped
            if (!options?.skipCompression && file.type.startsWith('image/')) {
                console.log(`[Compression] Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
                try {
                    const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);
                    console.log(`[Compression] Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
                    processedFile = compressedFile;
                } catch (cErr) {
                    console.warn("Image compression failed, uploading original.", cErr);
                }
            }

            const formData = new FormData();
            formData.append('file', processedFile);

            // Fetch API는 기본적으로 Upload Progress를 제공하지 않습니다.
            // Axios 등을 쓰면 가능하지만, 여기선 심플한 fetch를 사용합니다.
            // (대용량 파일이 아니므로 순식간에 끝납니다)



            const response = await fetch(WORKER_ENDPOINT, {
                method: 'POST',
                headers: {
                    'x-upload-token': UPLOAD_TOKEN
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText} `);
            }

            const data = await response.json();

            setProgress(100);
            setIsUploading(false);

            return data.url; // Worker가 반환한 Public URL

        } catch (err) {
            console.error("Upload error:", err);
            setError(err);
            setIsUploading(false);
            throw err;
        }
    };

    const remove = async () => {
        // R2 삭제 로직은 별도 DELETE API가 필요하므로, 
        // 프로토타입 단계에선 UI상에서만 지우는 것으로 처리합니다.
        return Promise.resolve();
    };

    return { upload, remove, progress, isUploading, error };
};
