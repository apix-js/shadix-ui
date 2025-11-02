"use client";

import * as React from "react";

import { TerminalSquare } from "lucide-react";

import { CopyButton } from "@/components/CopyButton";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shadcn/components/ui/tabs";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const InstallTabs: React.FC<InstallTabsProps> = ({ pkg, external = false }) => {
    const [value, setValue] = React.useState<PackageManager>("pnpm");
    // const [origin, setOrigin] = React.useState<string>('');

    // fix: Handle window access safely for SSR
    // React.useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         setOrigin(window.location.origin);
    //     }
    // }, []);

    let commands: Record<PackageManager, string> = {
        pnpm: `pnpm dlx shadcn@latest add @shadix-ui/${pkg}`,
        npm: `npx shadcn@latest add @shadix-ui/${pkg}`,
        yarn: `yarn dlx shadcn@latest add @shadix-ui/${pkg}`,
        bun: `bun x shadcn@latest add @shadix-ui/${pkg}`,
    };

    if (external) {
        const packages = Array.isArray(pkg) ? pkg.join(" ") : pkg;
        commands = {
            pnpm: `pnpm add ${packages}`,
            npm: `npm install ${packages}`,
            yarn: `yarn add ${packages}`,
            bun: `bun add ${packages}`,
        };
    }

    return (
        <div className="rounded-md bg-muted/50 p-0 relative">
            <Tabs
                value={value}
                onValueChange={(v) => setValue(v as PackageManager)}
                className="gap-0"
            >
                <div className="flex gap-2 items-center border-b border-border p-2 pb-2">
                    <TerminalSquare />

                    <div className="flex flex-1 items-center justify-between">
                        <TabsList className="h-9 space-x-1 bg-transparent p-0">
                            {Object.keys(commands).map((c) => (
                                <TabsTrigger
                                    value={c}
                                    key={c}
                                    className="data-[state=active]:bg-muted h-7 data-[state=active]:text-foreground rounded-md p-2 text-xs font-medium transition-all"
                                >
                                    {c}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <CopyButton value={commands[value]} />
                    </div>
                </div>

                {Object.entries(commands).map(([key, cmd]) => (
                    <TabsContent key={key} value={key}>
                        <ScrollArea>
                            <pre className="rounded-md p-3 text-sm font-mono text-muted-foreground">
                                {cmd}
                            </pre>
                        </ScrollArea>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

interface InstallTabsProps {
    pkg: string | string[];
    external?: boolean;
}

export default InstallTabs;
