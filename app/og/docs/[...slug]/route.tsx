import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
    _req: Request,
    { params }: RouteContext<"/og/docs/[...slug]">,
) {
    const { slug } = await params;

    let path = slug.slice(0, -1);

    if (path.length === 0 && path[0] === "components") {
        path = [];
    }

    const page = source.getPage(path);
    if (!page) notFound();

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

            <div tw="flex items-center justify-center absolute top-10 left-10 text-white">
                <svg
                    version="1.1"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    width={64}
                    height={64}
                    viewBox="0 0 1024 1024"
                >
                    <title tw="hidden">Shadix UI</title>
                    <path d="M511.97 259.12l69.69 40.22 79.63 46 79.7 45.99 79.63 46 109.69 63.31V270.47L711.27 144.03l-39.99-23.09-159.32-91.99-89.62 51.77-79.71 46-79.62 45.99-69.69 40.22h-.01l-14.72 8.5-25.29 14.6.01.01-59.62 34.44v115.08L631.3 695.99l-49.63 28.67-69.7 40.22-69.64-40.22-79.69-46-79.63-45.99-79.7-46-109.62-63.33v230.18l218.94 126.44 40 23.1 159.33 91.99 89.71-51.77 79.62-45.99 79.7-46 69.62-40.22 2.9-1.67 96.8-55.87V638.44L392.65 328.02l49.69-28.68z" />
                </svg>
                <span tw="text-4xl ml-2">Shadix UI</span>
            </div>

            {/* Main content area */}
            <div tw="flex-1 flex flex-col justify-center px-16">
                <h1 tw="text-6xl font-bold text-white leading-tight mb-6">
                    {page.data.title}
                </h1>
                <p tw="text-2xl text-gray-300 leading-relaxed max-w-4xl">
                    {page.data.description}
                </p>
                <span
                    tw="text-md bg-code text-gray-300 px-2 py-1 rounded-md inline-block"
                    style={{
                        backgroundColor: "#0f172b",
                    }}
                >
                    pnpm dlx shadcn@latest add @shadix-ui/
                    {page.slugs[page.slugs.length - 1]}
                </span>
            </div>

            {/* Author section - only show if author data is available */}
            {page.data?.author && (
                <div tw="flex items-center justify-center absolute bottom-10 right-10 text-white">
                    {page.data.authorImage && (
                        <picture tw="w-12 h-12 rounded-full overflow-hidden">
                            <source
                                srcSet={page.data.authorImage}
                                type="image/png"
                            />
                            <img
                                src={page.data.authorImage}
                                alt={page.data.author}
                                width={48}
                                height={48}
                            />
                        </picture>
                    )}

                    <div tw="flex flex-col ml-4">
                        <span tw="text-sm font-medium">{page.data.author}</span>
                        {page.data.authorUrl && (
                            <span tw="text-xs text-gray-300">
                                {page.data.authorUrl}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>,
        {
            width: 1200,
            height: 630,
        },
    );
}

export function generateStaticParams() {
    return source.getPages().map((page) => ({
        lang: page.locale,
        slug: getPageImage(page).segments,
    }));
}
