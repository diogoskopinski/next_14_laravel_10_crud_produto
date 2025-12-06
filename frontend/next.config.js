/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configurações para Docker
  output: 'standalone',
  // Para hot reload no Docker
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig
