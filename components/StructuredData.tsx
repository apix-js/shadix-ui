interface StructuredDataProps {
    data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
    return (
        <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data),
            }}
        />
    );
}

// feat: Organization schema for Shadix UI project
export function OrganizationSchema() {
    const data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Shadix UI",
        description:
            "Beautiful, accessible, and customizable React components built on top of shadcn/ui. Enhanced with modern animations and advanced interactions.",
        url: "https://shadix-ui.vercel.app",
        logo: "https://shadix-ui.vercel.app/logo.svg",
        sameAs: ["https://github.com/apix-js/shadix-ui"],
        founder: {
            "@type": "Person",
            name: "Gihan Rangana",
            url: "https://github.com/gihanrangana",
        },
        keywords: [
            "shadcn",
            "ui",
            "components",
            "react",
            "tailwind",
            "framer-motion",
            "motion",
            "motion-ui",
            "motion-components",
            "motion-documentation",
            "motion-examples",
            "shadcn-registry",
            "shadcn-custom-registry",
            "shadix-ui",
            "shadix-ui-registry",
            "shadix-ui-components",
            "shadix-ui-documentation",
            "shadix-ui-examples",
            "registry",
        ],
    };

    return <StructuredData data={data} />;
}

// feat: WebSite schema with search action
export function WebSiteSchema() {
    const data = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Shadix UI",
        description: "Custom shadcn/ui Registry with enhanced animations",
        url: "https://shadix-ui.vercel.app",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate:
                    "https://shadix-ui.vercel.app/api/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
        },
        publisher: {
            "@type": "Organization",
            name: "Shadix UI",
        },
    };

    return <StructuredData data={data} />;
}

// feat: SoftwareApplication schema for component library
export function SoftwareApplicationSchema() {
    const data = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Shadix UI",
        description:
            "Custom shadcn/ui component registry with enhanced animations and interactions",
        url: "https://shadix-ui.vercel.app",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        author: {
            "@type": "Organization",
            name: "Shadix UI",
        },
        downloadUrl: "https://github.com/apix-js/shadix-ui",
        softwareVersion: "1.0.0",
        releaseNotes:
            "Enhanced shadcn/ui components with Framer Motion animations",
    };

    return <StructuredData data={data} />;
}

// feat: TechArticle schema for documentation pages
export function TechArticleSchema({
    title,
    description,
    url,
    author,
    authorUrl,
    authorImage,
    publishedTime,
    modifiedTime,
    breadcrumbs,
}: {
    title: string;
    description: string;
    url: string;
    author?: string;
    authorUrl?: string;
    authorImage?: string;
    publishedTime?: string;
    modifiedTime?: string;
    breadcrumbs?: Array<{ name: string; url: string }>;
}) {
    const data = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: title,
        description,
        url,
        datePublished: publishedTime || new Date().toISOString(),
        dateModified: modifiedTime || new Date().toISOString(),
        author: author
            ? {
                  "@type": "Person",
                  name: author,
                  url: authorUrl,
                  image: authorImage,
              }
            : {
                  "@type": "Organization",
                  name: "Shadix UI",
              },
        publisher: {
            "@type": "Organization",
            name: "Shadix UI",
            logo: {
                "@type": "ImageObject",
                url: "https://shadix-ui.vercel.app/logo.svg",
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
        ...(breadcrumbs && {
            breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: breadcrumbs.map((crumb, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: crumb.name,
                    item: crumb.url,
                })),
            },
        }),
    };

    return <StructuredData data={data} />;
}
