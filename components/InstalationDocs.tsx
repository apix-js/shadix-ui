import type React from "react";

import { ComponentSource } from "@/components/ComponentSource";
import InstallTabs from "@/components/InstallTabs";
import { Index } from "@/registry/__index__";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shadcn/components/ui/tabs";

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
            <TabsList className="bg-transparent gap-2">
                <TabsTrigger
                    className="border-0 rounded-none data-[state=active]:shadow-none !bg-transparent data-[state=active]:border-b-muted-foreground dark:data-[state=active]:border-b-muted-foreground data-[state=active]:border-b-2"
                    value="cli"
                >
                    CLI
                </TabsTrigger>
                <TabsTrigger
                    className="border-0 rounded-none data-[state=active]:shadow-none !bg-transparent data-[state=active]:border-b-muted-foreground dark:data-[state=active]:border-b-muted-foreground data-[state=active]:border-b-2"
                    value="manual"
                >
                    Manual
                </TabsTrigger>
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
                        name={getFileName(f.path).replace(
                            /\.(tsx|ts|jsx|js)$/i,
                            "",
                        )}
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
