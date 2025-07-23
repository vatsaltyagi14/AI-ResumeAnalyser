/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', //whitelist kardia isko
        port: '',
        pathname: '/**',
      },
    ],
  },

  webpack: (config) => {
    config.resolve.alias.canvas = false;   // pdfjs-dist library keliye,it has a dependency that is incompatible with the nxtjs
    return config;
  },
};

export default nextConfig;
