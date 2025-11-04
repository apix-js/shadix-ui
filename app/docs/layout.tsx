import { DocsLayout } from "fumadocs-ui/layouts/notebook";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
    const base = baseOptions();

    return (
        <DocsLayout
            {...base}
            tree={source.pageTree}
            nav={{
                ...base.nav,
                mode: "top",
                // transparentMode: "always",
            }}
            sidebar={{
                prefetch: false,
            }}
            containerProps={{
                className:
                    "min-h-screen dark:bg-[#050505] bg-fixed dark:bg-[radial-gradient(circle_at_20%_10%,var(--color-slate-950)_0%,var(--color-stone-950)_40%)]",
            }}
        >
            <div className="absolute inset-0 bg-fixed z-[0] dark:bg-[radial-gradient(circle_at_100%_90%,var(--color-slate-950)_0%,transparent_30%)]" />
            <div className="relative z-[1]">{children}</div>
        </DocsLayout>
    );
}
