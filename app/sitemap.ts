import { statSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";

import { getRegistryBaseUrl, source } from "@/lib/source";
import { Index } from "@/registry/__index__";

export const dynamic = "force-dynamic";

// feat: Get file modification date for better sitemap accuracy
function getFileLastModified(filePath: string): Date {
    try {
        const stats = statSync(filePath);
        return stats.mtime;
    } catch {
        return new Date();
    }
}

// feat: Validate URL format for sitemap
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// feat: Generate sitemap data for Next.js App Router with enhanced error handling
function generateSitemapData(): MetadataRoute.Sitemap {
    const baseUrl = getRegistryBaseUrl();

    // feat: Validate base URL
    if (!isValidUrl(baseUrl)) {
        console.error("Invalid base URL for sitemap:", baseUrl);
        return [];
    }

    const sitemap: MetadataRoute.Sitemap = [];

    // Add homepage with validation
    const homepageUrl = `${baseUrl}/`;
    if (isValidUrl(homepageUrl)) {
        sitemap.push({
            url: homepageUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        });
    }

    // Add documentation pages with enhanced error handling
    try {
        const pages = source.getPages();
        if (Array.isArray(pages)) {
            pages.forEach((page) => {
                if (!page?.url) return;

                // feat: Try to get actual file modification date
                let lastModified = new Date();
                if (page.data?.lastModified) {
                    try {
                        lastModified = new Date(page.data.lastModified);
                        // Validate date
                        if (Number.isNaN(lastModified.getTime())) {
                            lastModified = new Date();
                        }
                    } catch {
                        lastModified = new Date();
                    }
                } else {
                    // Try to get file modification date from content directory
                    try {
                        const contentPath = join(
                            process.cwd(),
                            "content",
                            "docs",
                            `${page.url.replace("/docs/", "")}.mdx`,
                        );
                        lastModified = getFileLastModified(contentPath);
                    } catch {
                        // Fallback to current date
                        lastModified = new Date();
                    }
                }

                const pageUrl = `${baseUrl}${page.url}`;
                if (isValidUrl(pageUrl)) {
                    sitemap.push({
                        url: pageUrl,
                        lastModified,
                        changeFrequency: "monthly",
                        priority: 0.9,
                    });
                }
            });
        }
    } catch (error) {
        console.warn("Error generating sitemap for pages:", error);
    }

    // Add component registry JSON files with validation
    try {
        if (Index && typeof Index === "object") {
            Object.keys(Index).forEach((componentName) => {
                if (componentName.endsWith("-demo") || !componentName) return;

                // feat: Component registry JSON file with proper modification date
                const componentPath = join(
                    process.cwd(),
                    "public",
                    "r",
                    `${componentName}.json`,
                );
                const lastModified = getFileLastModified(componentPath);

                const componentUrl = `${baseUrl}/r/${componentName}.json`;
                if (isValidUrl(componentUrl)) {
                    sitemap.push({
                        url: componentUrl,
                        lastModified,
                        changeFrequency: "monthly",
                        priority: 0.6,
                    });
                }
            });
        }
    } catch (error) {
        console.warn("Error generating sitemap for components:", error);
    }

    // Add API endpoints and other important pages with validation
    const additionalUrls = [
        {
            url: `${baseUrl}/api/search`,
            changeFrequency: "weekly" as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/llms-full.txt`,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
    ];

    additionalUrls.forEach(({ url, changeFrequency, priority }) => {
        if (isValidUrl(url)) {
            sitemap.push({
                url,
                lastModified: new Date(),
                changeFrequency,
                priority,
            });
        }
    });

    return sitemap;
}

// feat: Export sitemap function for Next.js App Router
export default function sitemap(): MetadataRoute.Sitemap {
    return generateSitemapData();
}
