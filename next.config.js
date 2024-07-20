/*eslint-env node*/
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
  basePath: '/mithril-shib',
  assetPrefix: '/mithril-shib',
};

module.exports = nextConfig;
