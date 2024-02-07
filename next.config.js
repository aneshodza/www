/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml', // The API route that generates the sitemap
      },
    ];
  },
};

