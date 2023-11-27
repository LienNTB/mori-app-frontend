/** @type {import('next').NextConfig} */
const nextConfig = {
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
