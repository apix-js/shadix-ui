"use client";

import { Suspense, use } from "react";

import { notFound } from "next/navigation";

import { Index } from "@/registry/__index__";

interface DemoPageProps {
    params: Promise<{ slug: string }>;
}

// feat: Dynamically render demo components based on URL slug using registry
export default function DemoPage(props: DemoPageProps) {
    if (process.env.NODE_ENV === "production") {
        notFound();
    }

    const params = use(props.params);
    const slug = params.slug;

    // feat: Convert slug to registry name (e.g., "action-button" -> "action-button-demo")
    const registryName = `${slug}-demo`;
    const registryItem = Index[registryName];

    if (!registryItem || !registryItem.component) {
        notFound();
    }

    const DemoComponent = registryItem.component;

    return (
        <div className="mt-10 flex items-center justify-center h-auto">
            <Suspense
                fallback={
                    <div className="animate-pulse text-muted-foreground">
                        Loading demo...
                    </div>
                }
            >
                <DemoComponent />
            </Suspense>
        </div>
    );
}
