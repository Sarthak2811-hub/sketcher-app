import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://192.168.1.6:3003", "http://localhost:3003"],
};

export default nextConfig;