import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Exclude TensorFlow and MediaPipe from server-side bundling
  experimental: {
    serverComponentsExternalPackages: [
      '@tensorflow/tfjs',
      '@tensorflow-models/pose-detection',
      '@tensorflow/tfjs-core',
      '@tensorflow/tfjs-converter',
      '@tensorflow/tfjs-backend-webgl',
      '@tensorflow/tfjs-backend-cpu',
    ],
    // Add turbo configuration for mediapipe stub
    turbo: {
      resolveAlias: {
        '@mediapipe/pose': path.resolve(__dirname, './lib/mediapipe-stub.js'),
      },
    },
  },
};

export default nextConfig;
