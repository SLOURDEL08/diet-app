/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // En production, vous devriez probablement désactiver ceci
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig