/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    BACKEND_URL_DEV:
      process.env.BACKEND_URL_DEV ??
      process.env.NEXT_PUBLIC_BACKEND_URL_DEV ??
      "",
    ADMIN_URL_DEV: process.env.ADMIN_URL_DEV,
    FRONTEND_URL_DEV: process.env.FRONTEND_URL_DEV,
    ALLOW_ORIGIN_TOKEN: process.env.ALLOW_ORIGIN_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  future: {
    webpack5: true,
  },
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
  webpack(config) {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["localhost", "http://103.130.211.150:10047"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "moristorage123.blob.core.windows.net",
        pathname: "/bookimg/**",
      },
    ],
  },
};

module.exports = nextConfig;
