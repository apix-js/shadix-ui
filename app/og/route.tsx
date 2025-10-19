import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
    return new ImageResponse(
        <div
            tw="flex h-full w-full flex-col items-center justify-center bg-slate-900 overflow-hidden"
            style={{
                background:
                    "linear-gradient(135deg, rgba(2,6,24,1) 0%, #0f172b 100%)", // Subtle gradient
            }}
        >
            <div tw="flex items-center justify-center absolute top-0 bottom-0 right-[-200px] text-slate-900/70">
                <svg
                    version="1.1"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    width={750}
                    height={750}
                    viewBox="0 0 1024 1024"
                >
                    <title tw="hidden">Shadix UI</title>
                    <path d="M511.97 259.12l69.69 40.22 79.63 46 79.7 45.99 79.63 46 109.69 63.31V270.47L711.27 144.03l-39.99-23.09-159.32-91.99-89.62 51.77-79.71 46-79.62 45.99-69.69 40.22h-.01l-14.72 8.5-25.29 14.6.01.01-59.62 34.44v115.08L631.3 695.99l-49.63 28.67-69.7 40.22-69.64-40.22-79.69-46-79.63-45.99-79.7-46-109.62-63.33v230.18l218.94 126.44 40 23.1 159.33 91.99 89.71-51.77 79.62-45.99 79.7-46 69.62-40.22 2.9-1.67 96.8-55.87V638.44L392.65 328.02l49.69-28.68z" />
                </svg>
            </div>

            {/* Main content area */}
            <div tw="flex-1 flex flex-col justify-center px-32">
                <div tw="flex items-center justify-center text-white mb-12">
                    <svg
                        version="1.1"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        width={128}
                        height={128}
                        viewBox="0 0 1024 1024"
                    >
                        <title tw="hidden">Shadix UI</title>
                        <path d="M511.97 259.12l69.69 40.22 79.63 46 79.7 45.99 79.63 46 109.69 63.31V270.47L711.27 144.03l-39.99-23.09-159.32-91.99-89.62 51.77-79.71 46-79.62 45.99-69.69 40.22h-.01l-14.72 8.5-25.29 14.6.01.01-59.62 34.44v115.08L631.3 695.99l-49.63 28.67-69.7 40.22-69.64-40.22-79.69-46-79.63-45.99-79.7-46-109.62-63.33v230.18l218.94 126.44 40 23.1 159.33 91.99 89.71-51.77 79.62-45.99 79.7-46 69.62-40.22 2.9-1.67 96.8-55.87V638.44L392.65 328.02l49.69-28.68z" />
                    </svg>
                    <span tw="text-8xl ml-2">Shadix UI</span>
                </div>

                <div
                    tw="flex h-0.5 min-w-[60%] w-full mx-auto mb-6"
                    style={{
                        backgroundColor: "transparent",
                        background:
                            "linear-gradient(90deg,rgba(0, 0, 0, 0) 12%, rgba(255, 255, 255, 1) 50%, rgba(0, 0, 0, 0) 88%)",
                    }}
                ></div>

                <p tw="text-center text-white text-2xl text-gray-300 max-w-[80%] leading-relaxed">
                    Beautiful, accessible, and customizable React components
                    built on top of shadcn/ui. Enhanced with modern animations
                    and advanced interactions.
                </p>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
        },
    );
}
