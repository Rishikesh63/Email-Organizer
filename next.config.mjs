/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Exposing environment variable for OpenAI API key
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  reactStrictMode: true,  // Enabling React Strict Mode for better development checks
  productionBrowserSourceMaps: true,  // Enable source maps for easier debugging in production

  webpack: (config) => {
    // Modify webpack configuration here if needed
    return config;
  },
};

// Use ES Module export syntax
export default nextConfig;
