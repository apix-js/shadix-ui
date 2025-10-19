import { findNeighbour } from "fumadocs-core/page-tree";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle,
} from "fumadocs-ui/page";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AIOpenButton } from "@/components/AIOpenButton";
import AuthorCard from "@/components/AuthorCard";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { TechArticleSchema } from "@/components/StructuredData";
import { getPageImage, source } from "@/lib/source";
import { getAbsoluteUrl } from "@/lib/utils";
import { getMDXComponents } from "@/mdx-components";
import { Button } from "@/shadcn/components/ui/button";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    const MDX = page.data.body;
    const neighbours = await findNeighbour(source.pageTree, page.url);

    // feat: Generate breadcrumbs for structured data
    const breadcrumbs = [
        { name: "Home", url: "https://shadix-ui.vercel.app" },
        { name: "Documentation", url: "https://shadix-ui.vercel.app/docs" },
    ];

    // Add intermediate breadcrumbs based on URL segments
    const urlSegments = page.url.split("/").filter(Boolean);
    let currentPath = "https://shadix-ui.vercel.app/docs";

    for (let i = 0; i < urlSegments.length - 1; i++) {
        currentPath += `/${urlSegments[i]}`;
        const segmentName =
            urlSegments[i].charAt(0).toUpperCase() + urlSegments[i].slice(1);
        breadcrumbs.push({ name: segmentName, url: currentPath });
    }

    // Add current page
    breadcrumbs.push({ name: page.data.title, url: getAbsoluteUrl(page.url) });

    return (
        <>
            <TechArticleSchema
                title={page.data.title}
                description={page.data.description as string}
                url={getAbsoluteUrl(page.url)}
                author={page.data.author}
                authorUrl={page.data.authorUrl}
                authorImage={page.data.authorImage}
                publishedTime={
                    page.data.lastModified
                        ? new Date(page.data.lastModified).toISOString()
                        : undefined
                }
                modifiedTime={
                    page.data.lastModified
                        ? new Date(page.data.lastModified).toISOString()
                        : undefined
                }
                breadcrumbs={breadcrumbs}
            />
            <BreadcrumbSchema breadcrumbs={breadcrumbs} />
            <DocsPage
                toc={page.data.toc}
                tableOfContent={{
                    enabled: true,
                    style: "clerk",
                }}
                tableOfContentPopover={{
                    style: "clerk",
                }}
                full={page.data.full}
            >
                <div className="flex items-center gap-2 justify-between">
                    <DocsTitle className="flex-1 text-4xl text-foreground">
                        {page.data.title}
                    </DocsTitle>

                    <div className="flex h-full items-center gap-2">
                        <AIOpenButton url={getAbsoluteUrl(page.url)} />

                        {neighbours.previous && (
                            <Button
                                variant="secondary"
                                size="icon"
                                className="extend-touch-target ml-auto size-8 shadow-none md:size-7"
                                asChild
                            >
                                <Link href={neighbours.previous.url}>
                                    <ArrowLeftIcon />
                                    <span className="sr-only">Previous</span>
                                </Link>
                            </Button>
                        )}

                        {neighbours.next && (
                            <Button
                                variant="secondary"
                                size="icon"
                                className="extend-touch-target size-8 shadow-none md:size-7"
                                asChild
                            >
                                <Link href={neighbours.next.url}>
                                    <span className="sr-only">Next</span>
                                    <ArrowRightIcon />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DocsDescription>{page.data.description}</DocsDescription>

                {page.data.author && (
                    <AuthorCard
                        author={{
                            name: page.data.author,
                            url: page.data.authorUrl || "",
                            image: page.data.authorImage || "",
                        }}
                    />
                )}

                <DocsBody>
                    <MDX
                        components={getMDXComponents({
                            // this allows you to link to other pages with relative file paths
                            a: createRelativeLink(source, page),
                        })}
                    />
                </DocsBody>
            </DocsPage>
        </>
    );
}

export async function generateStaticParams() {
    return source.generateParams();
}

export async function generateMetadata(
    props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    const baseUrl = "https://shadix-ui.vercel.app";
    const pageUrl = `${baseUrl}${page.url}`;

    return {
        title: page.data.title,
        description: page.data.description,
        authors: page.data.author
            ? [{ name: page.data.author, url: page.data.authorUrl }]
            : undefined,
        // feat: Article metadata for better SEO
        openGraph: {
            title: page.data.title,
            description: page.data.description,
            type: "article",
            publishedTime: page.data.lastModified
                ? new Date(page.data.lastModified).toISOString()
                : undefined,
            modifiedTime: page.data.lastModified
                ? new Date(page.data.lastModified).toISOString()
                : undefined,
            authors: page.data.author ? [page.data.author] : undefined,
            images: getPageImage(page).url,
            url: pageUrl,
        },
        twitter: {
            card: "summary_large_image",
            title: page.data.title,
            description: page.data.description,
            images: [getPageImage(page).url],
        },
        // feat: Canonical URL to prevent duplicate content
        alternates: {
            canonical: pageUrl,
        },
        // feat: Article-specific robots meta
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
    };
}
