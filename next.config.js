/*eslint-env node*/
/** @type {import('next').NextConfig} */
const nextConfig = require("@next/bundle-analyzer")({ enabled: false })({
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // output: "standalone", // this line will cause errors on windows
});

module.exports = nextConfig;
