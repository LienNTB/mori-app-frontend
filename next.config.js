/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    BACKEND_URL_DEV: process.env.BACKEND_URL_DEV,
    ADMIN_URL_DEV: process.env.ADMIN_URL_DEV,
    FRONTEND_URL_DEV: process.env.FRONTEND_URL_DEV,
  },
  future: {
    webpack5: true,
  },

  webpack(config) {
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
    domains: ["localhost"],
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
