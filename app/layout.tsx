import { RootProvider } from 'fumadocs-ui/provider/next'
import { Inter } from 'next/font/google'

import '@/app/global.css'

const inter = Inter({
    subsets: ['latin'],
})

export default function Layout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
            <body className="headless flex flex-col min-h-screen" suppressHydrationWarning>
                <RootProvider
                    theme={{
                        themes: ['dark', 'light'],
                        defaultTheme: 'dark',
                        enabled: true,
                        enableSystem: true,
                    }}
                    search={{
                        enabled: true,
                    }}
                >
                    {children}
                </RootProvider>
            </body>
        </html>
    )
}
