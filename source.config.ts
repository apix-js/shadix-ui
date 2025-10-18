import {
    defineConfig,
    defineDocs,
    frontmatterSchema,
    metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

// feat: Extended frontmatter schema with author fields
const customFrontmatterSchema = frontmatterSchema.extend({
    author: z.string().optional(),
    authorUrl: z.url().optional(),
    authorImage: z.url().optional(),
});

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
    dir: "content/docs",
    docs: {
        schema: customFrontmatterSchema,
        postprocess: {
            includeProcessedMarkdown: true,
        },
    },
    meta: {
        schema: metaSchema,
    },
});

export default defineConfig({
    mdxOptions: {
        // MDX options
    },
});
