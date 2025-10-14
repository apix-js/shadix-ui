'use client'

import { Button } from '@/shadcn/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs'
import { Copy } from 'fumadocs-ui/internal/icons'
import { Clipboard, Terminal, TerminalSquare } from 'lucide-react'
import React, { useState } from 'react'

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

const getCommands = (command: string): Record<PackageManager, string> => {
    return {
        pnpm: `pnpm add ${command}`,
        npm: `npm install ${command}`,
        yarn: `yarn add ${command}`,
        bun: `bun add ${command}`,
    }
}

const InstallTabs: React.FC<InstallTabsProps> = ({ pkg }) => {
    const command = `shadcn@latest add ${process.env.NEXT_PUBLIC_SHADCN_REGISTRY_URL}/${pkg}`

    const [value, setValue] = useState<PackageManager>('pnpm')

    const handleCopy = () => {}

    return (
        <div className="rounded-md bg-muted/50 p-0">
            <Tabs value={value} onValueChange={(v) => setValue(v as PackageManager)} className="gap-0">
                <div className="flex gap-2 items-center border-b border-border p-2 pb-2">
                    <TerminalSquare />

                    <div className="flex flex-1 items-center justify-between">
                        <TabsList className="h-9 space-x-1 bg-transparent p-0">
                            {Object.keys(getCommands(command)).map((c) => (
                                <TabsTrigger
                                    value={c}
                                    key={c}
                                    className="data-[state=active]:bg-muted h-7 data-[state=active]:text-foreground rounded-md p-2 text-xs font-medium transition-all"
                                >
                                    {c}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopy}
                            title="Copy command"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                            <Clipboard className="h-4 w-4" />
                            <span className="sr-only">Copy command</span>
                        </Button>
                    </div>
                </div>

                {Object.entries(getCommands(command)).map(([key, cmd]) => (
                    <TabsContent key={key} value={key}>
                        <pre className="rounded-md p-3 text-sm font-mono text-muted-foreground">{cmd}</pre>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

interface InstallTabsProps {
    pkg: string
}

export default InstallTabs
