import { RootProvider } from "fumadocs-ui/provider/next";
import { Fira_Code, Inter } from "next/font/google";
import type { Metadata } from "next";

import { OrganizationSchema } from "@/components/StructuredData";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { Toaster } from "@/shadcn/components/ui/sonner";

import "@/app/global.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

const jetbrainsMono = Fira_Code({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NODE_ENV === "production"
            ? "https://shadix-ui.vercel.app"
            : "http://localhost:3000",
    ),
    title: {
        default: "Shadix UI - Custom shadcn/ui Registry",
        template: "%s | Shadix UI",
    },
    description:
        "Beautiful, accessible, and customizable React components built on top of shadcn/ui. Enhanced with modern animations and advanced interactions.",
    keywords: [
        "shadcn",
        "ui",
        "components",
        "react",
        "tailwind",
        "framer-motion",
        "registry",
        "typescript",
        "nextjs",
        "frontend",
        "web development",
    ],
    authors: [
        { name: "apix-js", url: "https://github.com/apix-js" },
        { name: "Gihan Rangana", url: "https://github.com/gihanrangana" },
    ],
    creator: "Gihan Rangana",
    publisher: "Shadix UI",
    category: "Technology",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    // feat: Verification meta tags (placeholders for user to fill in)
    verification: {
        // google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
        // yahoo: "your-yahoo-verification-code",
        // other: {
        //     "msvalidate.01": "your-bing-verification-code",
        // },
    },
    alternates: {
        canonical: "https://shadix-ui.vercel.app",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://shadix-ui.vercel.app",
        siteName: "Shadix UI",
        title: "Shadix UI - Custom shadcn/ui Registry",
        description:
            "Beautiful, accessible, and customizable React components built on top of shadcn/ui.",
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
            "Beautiful, accessible, and customizable React components built on top of shadcn/ui.",
        images: ["/og"],
        creator: "@gihanrangana",
    },
};

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning
        >
            <head>
                <OrganizationSchema />
            </head>
            <body
                className={`headless flex flex-col min-h-screen ${inter.className}`}
                suppressHydrationWarning
            >
                <ScrollArea className="h-screen">
                    <RootProvider
                        theme={{
                            themes: ["dark", "light"],
                            defaultTheme: "dark",
                            enabled: true,
                            enableSystem: true,
                            enableColorScheme: true,
                        }}
                        search={{
                            enabled: true,
                        }}
                    >
                        {children}
                        <Toaster position="top-center" />
                    </RootProvider>

                    <div className="flex flex-col items-center justify-center relative py-8 z-10">
                        <p className="text-sm text-muted-foreground text-center ">
                            Built by{" "}
                            <a
                                href="https://github.com/gihanrangana"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:text-foreground text-stone-300 transition-colors duration-200"
                            >
                                Gihan (apix-js)
                            </a>{" "}
                            for{" "}
                            <a
                                href="https://ui.shadcn.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:text-foreground text-stone-300 transition-colors duration-200"
                            >
                                Shadcn
                            </a>{" "}
                            at{" "}
                            <a
                                href="https://vercel.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:text-foreground text-stone-300 transition-colors duration-200"
                            >
                                Vercel
                            </a>
                            . Source code on{" "}
                            <a
                                href="https://github.com/apix-js/shadix-ui"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:text-foreground text-stone-300 transition-colors duration-200"
                            >
                                GitHub
                            </a>
                            .
                        </p>
                    </div>
                </ScrollArea>
            </body>
        </html>
    );
}
