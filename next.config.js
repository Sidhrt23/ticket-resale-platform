// Require dotenv at the top
require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        dns: false,
        net: false,
        tls: false
      };
      return config;
    }
  }
  
  module.exports = nextConfig