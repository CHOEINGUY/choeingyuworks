import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export const alt = '최인규 - Business Solution Engineer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const isKo = locale === 'ko';

  // Load profile image
  const profilePath = join(process.cwd(), 'public', 'profile.jpg');
  const profileImage = readFileSync(profilePath);
  const profileSrc = `data:image/jpeg;base64,${profileImage.toString('base64')}`;

  // Load Pretendard Font (using a local fallback or CDN if possible, here using standard font fetch pattern)
  // For reliability in this environment, we'll try to fetch it. If it fails, we fall back to system font.
  let fontData: ArrayBuffer | null = null;
  try {
      const fontUrl = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/public/static/Pretendard-Bold.otf'; 
      const res = await fetch(fontUrl);
      if (res.ok) {
          fontData = await res.arrayBuffer();
      }
  } catch (e) {
      console.error('Failed to load font', e);
  }

  const text = {
    role: "Business Solution Engineer",
    name: "최인규", // Changed from Choeingyu
    tagline: isKo 
      ? "비즈니스 흐름을 읽고,\n기술로 실질적인 답을 찾습니다."
      : "Reading business flows and\nproviding practical technological solutions.",
  };

  return new ImageResponse(
    (
      <div
        style={{
          background: '#f1f3f5', // Softer background
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fontData ? '"Pretendard"' : 'sans-serif',
        }}
      >
        {/* Card Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
            width: '85%',
            height: '70%',
            borderRadius: 32,
            boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
            padding: '60px',
            justifyContent: 'space-between',
          }}
        >
          {/* Header Section: Avatar + Name + Role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Top Row: Avatar and Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {/* Avatar - Small Circle */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#eee',
                }}
              >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileSrc}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Name and Role Block */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                    style={{
                        fontSize: 48,
                        fontWeight: 700,
                        color: '#191f28', // Pretendard black
                        lineHeight: 1.2,
                    }}
                >
                    {text.name}
                </div>
                <div
                    style={{
                        fontSize: 24,
                        color: '#8b95a1', // Muted gray
                        fontWeight: 500,
                        marginTop: 4,
                    }}
                >
                    {text.role}
                </div>
              </div>
            </div>
          </div>

          {/* Description Body */}
          <div
            style={{
              fontSize: 32,
              color: '#333d4b',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all', // Korean optimization
              fontWeight: 600,
            }}
          >
            {text.tagline}
          </div>

          {/* Footer / Branding */}
          <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '2px solid #f2f4f6',
                paddingTop: 30,
            }}
          >
             <div style={{ fontSize: 20, color: '#8b95a1', fontWeight: 500 }}>
                choeingyu.works
             </div>
             {/* Brand Icon (Infinity) - Muted */}
             <svg
                 width="32"
                 height="32"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="#adb5bd"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
               >
                 <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
               </svg>
          </div>

        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
      ? [
          {
            name: 'Pretendard',
            data: fontData,
            style: 'normal',
            weight: 700,
          },
        ]
      : undefined,
    }
  );
}
