/** @type {import('next').NextConfig} */
module.exports = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }] },
  experimental: { serverActions: { bodySizeLimit: '5mb' } },
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    ] }];
  },
};
