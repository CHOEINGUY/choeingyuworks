import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export const alt = 'Choeingyu - Business Solution Engineer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
export default async function Image({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const isKo = locale === 'ko';

  const text = {
    role: "Business Solution Engineer",
    tagline: isKo 
      ? "비즈니스 흐름을 읽고, 기술로 실질적인 답을 찾습니다."
      : "Reading business flows and providing practical technological solutions.",
  };

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background Patterns */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: 'linear-gradient(135deg, #eee 0%, white 100%)',
            borderRadius: '50%',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 300,
            height: 300,
            background: 'linear-gradient(135deg, #f5f5f5 0%, white 100%)',
            borderRadius: '50%',
            opacity: 0.5,
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            zIndex: 10,
          }}
        >
          {/* Logo / Icon Area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
             {/* Infinity Icon Representation */}
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
              </svg>
          </div>

          {/* Name & Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: '#111',
                margin: 0,
                letterSpacing: '-2px',
                lineHeight: 1.1,
              }}
            >
              Choeingyu
              <span style={{ color: '#666', fontWeight: 300 }}> Works</span>
            </h1>
            <p
              style={{
                fontSize: 32,
                color: '#444',
                margin: '10px 0 0 0',
                fontWeight: 500,
              }}
            >
              {text.role}
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 100,
              height: 4,
              background: '#333',
              margin: '30px 0',
              borderRadius: 2,
            }}
          />

          {/* Description / Tagline */}
          <p
            style={{
              fontSize: 24,
              color: '#666',
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.5,
              margin: 0,
              wordBreak: 'keep-all',
              padding: '0 40px',
            }}
          >
            {text.tagline}
          </p>
        </div>

        {/* Brand Tag at Bottom */}
        <div
            style={{
                position: 'absolute',
                bottom: 40,
                fontSize: 18,
                color: '#999',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
            }}
        >
            choeingyu.works
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
