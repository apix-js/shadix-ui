import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

import { docs } from "@/.source";
import { Index } from "@/registry/__index__";

// Dynamic domain detection for registry URLs
export function getRegistryBaseUrl(): string {
    // Priority order:
    // 1. Environment variable (for production)
    // 2. Vercel URL (for preview deployments)
    // 3. Localhost (for development)

    if (process.env.NEXT_PUBLIC_REGISTRY_URL) {
        return process.env.NEXT_PUBLIC_REGISTRY_URL;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    if (process.env.NODE_ENV === "development") {
        return "http://localhost:3000";
    }

    // Fallback to production domain
    return "https://shadix-ui.vercel.app";
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
    baseUrl: "/docs",
    source: docs.toFumadocsSource(),
    plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
    const segments = [...page.slugs, "image.png"];

    return {
        segments,
        url: `/og/docs/${segments.join("/")}`,
    };
}

export async function getLLMText(page: InferPageType<typeof source>) {
    const processed = await page.data.getText("processed");

    // Extract meaningful content from custom components
    let enhancedContent = processed;

    // Replace ComponentPreview with meaningful description
    enhancedContent = enhancedContent.replace(
        /<ComponentPreview name="([^"]+)"[^>]*\/>/g,
        (_match, componentName) => {
            const component = Index[componentName];
            if (component) {
                return `**Component Preview**: ${component.description || `Interactive preview of the ${componentName} component`}`;
            }
            return `**Component Preview**: Interactive preview of the ${componentName} component`;
        },
    );

    // Replace InstalationDocs with installation information
    enhancedContent = enhancedContent.replace(
        /<InstalationDocs name="([^"]+)" filepath="([^"]+)"[^>]*\/>/g,
        (_match, componentName, filepath) => {
            const component = Index[componentName];
            if (component) {
                const dependencies =
                    component.dependencies?.join(", ") || "None";
                const registryDeps =
                    component.registryDependencies?.join(", ") || "None";

                // Generate CLI installation commands for custom registry
                const registryBaseUrl = getRegistryBaseUrl();
                const cliCommands = [
                    `pnpm dlx shadcn@latest add ${componentName} --registry ${registryBaseUrl}/r/${componentName}.json`,
                    `npx shadcn@latest add ${componentName} --registry ${registryBaseUrl}/r/${componentName}.json`,
                    `yarn dlx shadcn@latest add ${componentName} --registry ${registryBaseUrl}/r/${componentName}.json`,
                    `bun x shadcn@latest add ${componentName} --registry ${registryBaseUrl}/r/${componentName}.json`,
                ];

                // Generate manual installation info with GitHub URLs and correct paths
                const manualInstall =
                    component.files
                        ?.map((file) => {
                            const fileName = file.path.split("/").pop();
                            const githubUrl =
                                file.githubUrl ||
                                `https://github.com/apix-js/shadix-ui/blob/main/${file.path}`;

                            // Determine correct installation path based on file type
                            let installPath: string;
                            if (file.type === "registry:lib") {
                                installPath = `lib/${fileName}`;
                            } else if (file.type === "registry:ui") {
                                installPath = `${filepath}/${fileName}`;
                            } else {
                                installPath = `${filepath}/${fileName}`;
                            }

                            return `- **${installPath}**: ${file.type === "registry:lib" ? "Utility library file" : "Component implementation file"}\n  - Raw URL: ${githubUrl}`;
                        })
                        .join("\n") ||
                    `- **${filepath}/${componentName}.tsx**: Component implementation file\n  - Raw URL: https://github.com/apix-js/shadix-ui/blob/main/registry/new-york/components/${componentName}.tsx`;

                return `**Installation**:

**CLI Installation:**
${cliCommands.map((cmd) => `- \`${cmd}\``).join("\n")}

**Manual Installation:**
${manualInstall}

**Dependencies:**
- External dependencies: ${dependencies}
- Registry dependencies: ${registryDeps}`;
            }
            return `**Installation**: Component files available in ${filepath}`;
        },
    );

    // Replace PropsTable with props information
    enhancedContent = enhancedContent.replace(
        /<PropsTable name="([^"]+)" filename="([^"]+)"[^>]*\/>/g,
        (_match, propsName, filename) => {
            const component = Index[filename];
            if (component?.meta?.api) {
                const api = component.meta.api as Record<string, unknown>;
                const props = Object.entries(api)
                    .map(([key, value]) => {
                        const desc =
                            (value as { description?: string })?.description ||
                            "No description available";
                        return `- **${key}**: ${desc}`;
                    })
                    .join("\n");
                return `**Props (${propsName})**:\n${props}`;
            }
            return `**Props (${propsName})**: See component interface for available properties`;
        },
    );

    return `# ${page.data.title} (${page.url})

${enhancedContent}`;
}
