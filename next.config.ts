import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@xenova/transformers", "sharp", "onnxruntime-node"],
};

export default nextConfig;
