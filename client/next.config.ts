import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  env: {
    APP_ENV: process.env.APP_ENV,
    APP_DOMAIN: process.env.APP_DOMAIN,
    NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_SERVER_SERVICE: process.env.NEXT_PUBLIC_SERVER_SERVICE,
  },
  experimental: {
    optimizeCss: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.yandex.net',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '8080',
      //   pathname: '/server-uploads/**',
      // },
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '4000',
      //   pathname: '/server-uploads/**',
      // },
      // {
      //   protocol: 'http',
      //   hostname: 'shop-nginx',
      //   port: '80',
      //   pathname: '/server-uploads/**',
      // },
      // {
      //   protocol: 'http',
      //   hostname: 'nginx',
      //   port: '80',
      //   pathname: '/server-uploads/**',
      // },
    ],
  },
  async rewrites() {
    // return []
    if (isProd) {
      return [];
    }
    return [
      {
        source: '/server-uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/server-uploads/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/server-uploads/:path*`,
      },
      {
        source: '/:path*/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_SERVER_SERVICE}/api/:path*`,
      },
    ];
  },
  ...(isProd && { output: 'standalone' }),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
