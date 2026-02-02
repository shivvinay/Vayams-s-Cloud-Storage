/*
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
};

export default nextConfig;
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    middlewareClientMaxBodySize: '100mb', // or '100mb'
  },
};

module.exports = nextConfig;

