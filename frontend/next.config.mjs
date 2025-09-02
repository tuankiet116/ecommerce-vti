/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [new URL("http://localhost:8000/**")],
    },
    experimental: {
        viewTransition: true,
    },
};

export default nextConfig;
