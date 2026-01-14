import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/:locale(ko|en|ja)/portfolio',
        destination: '/:locale?tab=portfolio',
      },
      {
        source: '/portfolio',
        destination: '/?tab=portfolio',
      },
      {
        source: '/:locale(ko|en|ja)',
        destination: '/:locale?tab=about',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
