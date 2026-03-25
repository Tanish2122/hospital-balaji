/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable built-in compression (Brotli/GZIP)
  compress: true,

  images: {
    // Serve modern formats automatically — huge LCP improvement
    formats: ['image/avif', 'image/webp'],

    // Fine-tuned breakpoints for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Only use remotePatterns (domains is deprecated in Next 15)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.balajihospitals.co.in',
      },
      {
        protocol: 'https',
        hostname: 'balajihospitaljaipur.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.behold.pictures',
      },
      {
        protocol: 'https',
        hostname: 'yroieafhxcorwitzwyjj.supabase.co',
      },
    ],
  },

  // Performance & security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
