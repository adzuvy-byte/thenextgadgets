/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: `npm run build` writes plain HTML to the "out" folder.
  output: 'export',
  // Same URL shape as WordPress: /{slug}/
  trailingSlash: true,
  reactStrictMode: true,
  images: {unoptimized: true},
  eslint: {ignoreDuringBuilds: true},
}

export default nextConfig
