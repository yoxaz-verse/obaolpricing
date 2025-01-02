/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '',
                pathname: '/upload/**',
            },
            {
                protocol: 'https',
                hostname: 'activity-tracking-backend-m5o1.onrender.com',
                port: '',
                pathname: '/upload/**',
            }
        ],
        domains: ['localhost', 'activity-tracking-backend-m5o1.onrender.com'],
    },
};

export default nextConfig;
