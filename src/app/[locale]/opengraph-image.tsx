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

  // Font Loading Logic
  // 1. Try to read from local file system (public/fonts) - Best for performance and offline
  // 2. Try to fetch from CDN - Fallback
  // 3. Fallback to a system font or Next.js built-in font to prevent crash
  
  const loadFont = async (filename: string, url: string): Promise<ArrayBuffer | null> => {
      // Try local file
      try {
          const localPath = join(process.cwd(), 'public', 'fonts', filename);
          return readFileSync(localPath);
      } catch {
          // Ignore error, try fetch
      }

      // Try fetch
      try {
          const res = await fetch(url);
          if (res.ok) return await res.arrayBuffer();
      } catch (fetchError) {
          console.error(`Failed to fetch font ${filename}`, fetchError);
      }

      return null;
  };

  const [fontDataBold, fontDataRegular] = await Promise.all([
      loadFont('Pretendard-Bold.otf', 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/public/static/Pretendard-Bold.otf'),
      loadFont('Pretendard-Regular.otf', 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/public/static/Pretendard-Regular.otf')
  ]);

  // Fallback to prevent "No fonts loaded" error if everything fails
  let fallbackFont: ArrayBuffer | null = null;
  if (!fontDataBold && !fontDataRegular) {
      try {
          // Try to find a fallback in node_modules (Next.js usually bundles one for OG)
          const fallbackPath = join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'noto-sans-v27-latin-regular.ttf');
           // fallback logic requires fs.existsSync check to avoid crash if path changes in future versions
           // using readFileSync in try block is enough.
          fallbackFont = readFileSync(fallbackPath);
       } catch {
          console.warn("Failed to load fallback font");
      }
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
            background: 'white', // Main background is now white
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: fontDataBold ? '"Pretendard"' : 'sans-serif',
            padding: '60px', // Content padding
            position: 'relative', // For absolute positioning of background elements
            overflow: 'hidden', // Clip background elements
          }}
        >
          {/* Background Design Elements: "Twin Spheres" */}
          
          {/* Sphere 1: Rightmost - Darker Anchor */}
          <div
            style={{
              position: 'absolute',
              bottom: '-20%',
              right: '-10%',
              width: '660px', // Reduced slightly from 700px
              height: '660px',
              borderRadius: '50%',
              // Brighter start: Pure White start, darker gray end
              background: 'linear-gradient(135deg, #ffffff 0%, #868e96 100%)',
              filter: 'blur(6px)', 
              zIndex: 0,
              opacity: 1,
            }}
          />

          {/* Sphere 2: Left/Overlapping - Lighter Companion */}
          <div
            style={{
              position: 'absolute',
              bottom: '-20%', // Same height as Sphere 1
              right: '20%',   // Moved right (was 25%)
              width: '660px', // Restored equality & reduced slightly
              height: '660px',
              borderRadius: '50%',
              // Brighter start: Pure White start, medium gray end
              background: 'linear-gradient(135deg, #ffffff 0%, #adb5bd 100%)', 
              filter: 'blur(6px)', 
              zIndex: 0,
              opacity: 0.7, // More transparent to show overlap
            }}
          />

          {/* Removed 3rd Sphere */}

          {/* Header Section: Avatar + Name + Role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', zIndex: 1 }}>
            {/* Top Row: Avatar and Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {/* Avatar - Larger */}
              <div
                style={{
                  width: 140,
                  height: 140,
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
                        fontSize: 80, // Larger (was 72)
                        fontWeight: 700, // Matched to loaded font weight (Bold = 700)
                        color: 'black', // Black
                        lineHeight: 1.1,
                    }}
                >
                    {text.name}
                </div>
                <div
                    style={{
                        fontSize: 48, // Larger (was 40)
                        color: 'black', // Black
                        fontWeight: 400, // Normal weight as requested
                        marginTop: 12, // More gap
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
              fontSize: 48, // Even Larger for impact
              color: 'black', // Black
              lineHeight: 1.3,
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
              fontWeight: 700, // Matched to loaded font weight (Bold = 700)
              position: 'relative',
              zIndex: 1,
            }}
          >
             {`비즈니스 흐름을 읽고 기술로 답을 찾는 '솔루션 빌더'.\n복잡한 프로세스를 단순화하여, 자동화로 확실한 효율을 만듭니다.`}
          </div>

          {/* Footer / Branding */}
          <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end', // Align to right
                borderTop: 'none', // Removed border if user wants clean look, or keep it? User didn't specify, but "just put text on bottom right". Let's keep it simple.
                // User said "choeingyu works만 오른쪾 하단에". Removing border might look cleaner with the full bleed style.
                // Let's remove the border to match the "big card" feel.
                paddingTop: 0,
                position: 'relative',
                zIndex: 1,
            }}
          >
             {/* Brand Logo & Text to match Navbar */}
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Infinity Logo (Black) */}
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="3" // Thicker stroke
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
                </svg>
                <div style={{ fontSize: 32, color: 'black', fontWeight: 700, letterSpacing: '-0.02em' }}>
                    Choeingyu Works
                </div>
             </div>
          </div>

      </div>
    ),
    {
      ...size,
      fonts: [
          ...(fontDataBold ? [{
            name: 'Pretendard',
            data: fontDataBold,
            style: 'normal' as const,
            weight: 700,
          }] : []),
          ...(fontDataRegular ? [{
            name: 'Pretendard',
            data: fontDataRegular,
            style: 'normal' as const,
            weight: 400,
          }] : []),
          ...(fallbackFont ? [{
              name: 'sans-serif',
              data: fallbackFont,
              style: 'normal' as const,
              weight: 400,
          }] : []),
      ],
    }
  );
}
