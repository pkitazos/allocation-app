/*eslint-env node*/
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",

  // async headers() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "http://localhost:3000", // Set your origin
  //         },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET, POST, PUT, DELETE, OPTIONS",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value: "Content-Type, Authorization",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
