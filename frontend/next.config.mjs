/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            new URL("http://localhost:8000/**"),
            // Add API domain patterns for different environments
            ...(process.env.NEXT_PUBLIC_API_URL ? [new URL(process.env.NEXT_PUBLIC_API_URL + "/**")] : []),
        ],
    },
    experimental: {
        viewTransition: true,
    },
    // Enable standalone output for Docker
    output: "standalone",
    // Disable telemetry in production
    telemetry: {
        disabled: process.env.NODE_ENV === "production",
    },
};

export default nextConfig;
