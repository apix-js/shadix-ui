import { statSync } from "fs";
import { join } from "path";
import type { MetadataRoute } from "next";

import { getRegistryBaseUrl, source } from "@/lib/source";
import { Index } from "@/registry/__index__";

// feat: Get file modification date for better sitemap accuracy
function getFileLastModified(filePath: string): Date {
    try {
        const stats = statSync(filePath);
        return stats.mtime;
    } catch {
        return new Date();
    }
}

const sitemap = (): MetadataRoute.Sitemap => {
    const baseUrl = getRegistryBaseUrl();

    const sitemap: MetadataRoute.Sitemap = [];

    sitemap.push({
        url: `${baseUrl}/`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
    });

    try {
        const pages = source.getPages();
        pages.forEach((page) => {
            // feat: Try to get actual file modification date
            let lastModified = new Date();
            if (page.data.lastModified) {
                lastModified = new Date(page.data.lastModified);
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

            sitemap.push({
                url: `${baseUrl}${page.url}`,
                lastModified,
                changeFrequency: "monthly",
                priority: 0.9,
            });
        });
    } catch (error) {
        console.warn("Error generating sitemap", error);
    }

    Object.keys(Index).forEach((componentName) => {
        if (componentName.endsWith("-demo")) return;

        // feat: Component registry JSON file with proper modification date
        const componentPath = join(
            process.cwd(),
            "public",
            "r",
            `${componentName}.json`,
        );
        const lastModified = getFileLastModified(componentPath);

        sitemap.push({
            url: `${baseUrl}/r/${componentName}.json`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.6,
        });
    });

    sitemap.push(
        {
            url: `${baseUrl}/api/search`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/llms-full.txt`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
    );

    return sitemap;
};

export default sitemap;
