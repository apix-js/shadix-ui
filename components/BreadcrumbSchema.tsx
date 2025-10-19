import { StructuredData } from "./StructuredData";

interface BreadcrumbSchemaProps {
    breadcrumbs: Array<{ name: string; url: string }>;
}

// feat: Breadcrumb structured data for better search result navigation
export function BreadcrumbSchema({ breadcrumbs }: BreadcrumbSchemaProps) {
    const data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    };

    return <StructuredData data={data} />;
}
