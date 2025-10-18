import { RootProvider } from "fumadocs-ui/provider/next";
import { Fira_Code, Inter } from "next/font/google";

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

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning
        >
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
                </ScrollArea>
            </body>
        </html>
    );
}
