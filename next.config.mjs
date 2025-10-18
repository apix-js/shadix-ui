import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    rewrites: async () => {
        return [
            {
                source: '/docs/:path*.mdx',
                destination: '/llms.mdx/:path*',
            },
            {
                source: '/docs/:path*.png',
                destination: '/og/docs/:path*/image.png',
            }
        ]
    }
};

export default withMDX(config);
