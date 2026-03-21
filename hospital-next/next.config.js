/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    ],
  },
};

module.exports = nextConfig;
