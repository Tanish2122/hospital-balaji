/** @type {import('next').NextConfig} */
const nextConfig = {
  // 301 Redirects: old /departments/ URLs → new SEO-friendly URLs
  async redirects() {
    return [
      // ── Orthopedic category ───────────────────────────────────────────
      { source: '/departments/orthopedic', destination: '/orthopedic', permanent: true },
      // ── Orthopedic service pages ──────────────────────────────────────
      { source: '/departments/orthopedic/knee-replacement',           destination: '/orthopedic/best-knee-replacement-hospital-in-jaipur',            permanent: true },
      { source: '/departments/orthopedic/hip-replacement',            destination: '/orthopedic/hip-replacement-hospital-in-jaipur',                  permanent: true },
      { source: '/departments/orthopedic/spine-treatment',            destination: '/orthopedic/spine-treatment-in-jaipur',                           permanent: true },
      { source: '/departments/orthopedic/fracture-treatment',         destination: '/orthopedic/best-fracture-treatment-in-jaipur',                   permanent: true },
      { source: '/departments/orthopedic/shoulder-arthroscopy',       destination: '/orthopedic/shoulder-arthroscopy-replacement-in-jaipur',          permanent: true },
      { source: '/departments/orthopedic/hand-upper-limb',            destination: '/orthopedic/hand-upper-limb-surgery-in-jaipur',                   permanent: true },
      { source: '/departments/orthopedic/ankle-replacement',          destination: '/orthopedic/ankle-replacement-in-jaipur',                         permanent: true },
      { source: '/departments/orthopedic/joint-pain-treatment',       destination: '/orthopedic/joint-pain-treatment-in-jaipur',                      permanent: true },
      { source: '/departments/orthopedic/paediatric-orthopaedics',   destination: '/orthopedic/paediatric-orthopaedics-treatment-in-jaipur',         permanent: true },
      { source: '/departments/orthopedic/physiotherapy',              destination: '/orthopedic/physiotherapy-and-rehabilitation-centre-in-jaipur',   permanent: true },
      { source: '/departments/orthopedic/general-orthopaedics',      destination: '/orthopedic/best-orthopedic-hospital-in-jaipur',                  permanent: true },
      { source: '/departments/orthopedic/sports-medicine',            destination: '/orthopedic/best-sports-medicine-hospital-in-jaipur',             permanent: true },
      // ── ENT ──────────────────────────────────────────────────────────
      { source: '/departments/ent',                                   destination: '/ent',                                                             permanent: true },
      { source: '/departments/ent/ear-surgery',                       destination: '/ent/best-ear-surgery-hospital-in-jaipur',                        permanent: true },
      { source: '/departments/ent/nose-surgery',                      destination: '/ent/best-nose-surgery-hospital-in-jaipur',                       permanent: true },
      { source: '/departments/ent/throat-surgery',                    destination: '/ent/best-throat-surgery-hospital-in-jaipur',                     permanent: true },
      // ── Speciality ───────────────────────────────────────────────────
      { source: '/departments/speciality',                            destination: '/speciality',                                                      permanent: true },
      { source: '/departments/speciality/kidney-stones',             destination: '/speciality/kidney-stones-treatment-in-jaipur',                   permanent: true },
      { source: '/departments/speciality/plastic-vascular-surgery',  destination: '/orthopedic/plastic-vascular-surgery-in-jaipur',                  permanent: true },
      // ── Trailing slash normalization ──────────────────────────────────
      { source: '/orthopedic/',  destination: '/orthopedic',  permanent: true },
      { source: '/ent/',         destination: '/ent',         permanent: true },
      { source: '/speciality/',  destination: '/speciality',  permanent: true },
    ];
  },
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
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
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
