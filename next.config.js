/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      "581005886543-016nfq2fq93sjroi50n8puejk9n1r9h3.apps.googleusercontent.com",
    NEXT_PUBLIC_BACKEND_URL_DEV: "http://localhost:8080",
    NEXT_PUBLIC_ADMIN_URL_DEV: "http://localhost:8080",
    NEXT_PUBLIC_FRONTEND_URL_DEV: "http://localhost:8080",
    NEXT_PUBLIC_ALLOW_ORIGIN_TOKEN: "huonglienhcmutefit123",
    NEXT_PUBLIC_JWT_SECRET: "hcmutefitmoriauth",
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
