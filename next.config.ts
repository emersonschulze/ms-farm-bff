import type { NextConfig } from 'next';

// CORS is handled centrally in src/middleware.ts
const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
