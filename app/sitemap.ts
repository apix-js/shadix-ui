import type { MetadataRoute } from "next";

import { getRegistryBaseUrl, source } from "@/lib/source";
import { Index } from "@/registry/__index__";

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
            sitemap.push({
                url: `${baseUrl}${page.url}`,
                lastModified: page.data.lastModified
                    ? new Date(page.data.lastModified)
                    : new Date(),
                changeFrequency: "monthly",
                priority: 0.9,
            });
        });
    } catch (error) {
        console.warn("Error generating sitemap", error);
    }

    Object.keys(Index).forEach((componentName) => {
        if (componentName.endsWith("-demo")) return;

        // feat: Component registry JSON file
        sitemap.push({
            url: `${baseUrl}/r/${componentName}.json`,
            lastModified: new Date(),
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
