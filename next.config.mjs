/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Images are pre-optimised (webp) in /public, so no image-optimiser runtime is needed on Netlify.
  images: { unoptimized: true },
  async headers() {
    return [
      { source: '/:path*', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ] },
      { source: '/(flyers|brand|house-rules|audio|video)/:path*', headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ] },
    ];
  },
};
export default nextConfig;
