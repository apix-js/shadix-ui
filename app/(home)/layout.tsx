import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";

import { baseOptions } from "@/lib/layout.shared";

// feat: Home page specific metadata for SEO
export const metadata: Metadata = {
    title: "Shadix UI - Custom shadcn/ui Registry",
    description:
        "Beautiful, accessible, and customizable React components built on top of shadcn/ui. Enhanced with modern animations and advanced interactions.",
    keywords: [
        "shadcn ui",
        "react components",
        "tailwind css",
        "framer motion",
        "typescript",
        "nextjs",
        "ui library",
        "component registry",
        "frontend development",
        "web components",
    ],
    openGraph: {
        title: "Shadix UI - Custom shadcn/ui Registry",
        description:
            "Beautiful, accessible, and customizable React components built on top of shadcn/ui. Enhanced with modern animations and advanced interactions.",
        type: "website",
        url: "https://shadix-ui.vercel.app",
        images: [
            {
                url: "/og",
                width: 1200,
                height: 630,
                alt: "Shadix UI - Custom shadcn/ui Registry",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Shadix UI - Custom shadcn/ui Registry",
        description:
            "Beautiful, accessible, and customizable React components built on top of shadcn/ui. Enhanced with modern animations and advanced interactions.",
        images: ["/og"],
    },
    alternates: {
        canonical: "https://shadix-ui.vercel.app",
    },
};

export default function Layout({ children }: LayoutProps<"/">) {
    return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
