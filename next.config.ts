import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000', // Include the port if applicable
                pathname: '/uploads/**', // First path pattern
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/prediction_results/**', // Second path pattern
            },
        ],
    },
};

export default nextConfig;

