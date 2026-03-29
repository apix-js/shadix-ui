import type React from "react";

import Link from "next/link";

import { ComponentSource } from "@/components/ComponentSource";
import { Icons } from "@/components/Icons";
import InstallTabs from "@/components/InstallTabs";
import { Index } from "@/registry/__index__";
import { Button } from "@/shadcn/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shadcn/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";

const getFileName = (filepath: string) => {
    const files = filepath.split("/");
    return files[files.length - 1];
};

const InstalationDocs: React.FC<InstalationDocsProps> = ({
    name,
    filepath,
}) => {
    const pkg = Index[name];

    return (
        <Tabs defaultValue="cli">
            <TabsList className="flex w-full justify-between gap-2 bg-transparent">
                <div>
                    <TabsTrigger
                        className="!bg-transparent rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-b-muted-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-b-muted-foreground"
                        value="cli"
                    >
                        CLI
                    </TabsTrigger>
                    <TabsTrigger
                        className="!bg-transparent rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-b-muted-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-b-muted-foreground"
                        value="manual"
                    >
                        Manual
                    </TabsTrigger>
                </div>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" asChild>
                            <Link
                                href={pkg.files?.[0]?.githubUrl ?? "#"}
                                target="_blank"
                            >
                                <Icons.gitHub />
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open in GitHub</TooltipContent>
                </Tooltip>
            </TabsList>

            <TabsContent value="cli">
                <InstallTabs pkg={name} />
            </TabsContent>

            <TabsContent value="manual">
                {pkg.dependencies && pkg.dependencies.length > 0 && (
                    <>
                        <p className="not-prose mb-2">
                            Install required dependencies.
                        </p>
                        <InstallTabs pkg={pkg.dependencies} external />
                    </>
                )}

                {pkg.files.map((f) => (
                    <ComponentSource
                        key={f.path}
                        src={f.path}
                        name={getFileName(f.path).replace(
                            /\.(tsx|ts|jsx|js)$/i,
                            "",
                        )}
                        githubUrl={f.githubUrl}
                        title={`${filepath}/${getFileName(f.path)}`}
                    />
                ))}
            </TabsContent>
        </Tabs>
    );
};

interface InstalationDocsProps {
    name: string;
    filepath: string;
}

export { InstalationDocs };
