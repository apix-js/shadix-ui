'use client'

import * as React from 'react'

import { TerminalSquare } from 'lucide-react'

import { CopyButton } from '@/components/CopyButton'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/shadcn/components/ui/tabs'

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

const getCommands = (command: string): Record<PackageManager, string> => {
    return {
        pnpm: `pnpm add ${command}`,
        npm: `npm install ${command}`,
        yarn: `yarn add ${command}`,
        bun: `bun add ${command}`,
    }
}

const InstallTabs: React.FC<InstallTabsProps> = ({ pkg, external = false }) => {
    const [value, setValue] = React.useState<PackageManager>('pnpm')
    const [origin, setOrigin] = React.useState<string>('')

    // fix: Handle window access safely for SSR
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin)
        }
    }, [])

    let command = `shadcn@latest add ${origin}/${pkg}`

    if (external) {
        const packages = Array.isArray(pkg) ? pkg.join(' ') : pkg
        command = `${packages}`
    }

    return (
        <div className='rounded-md bg-muted/50 p-0 relative'>
            <Tabs
                value={value}
                onValueChange={(v) => setValue(v as PackageManager)}
                className='gap-0'
            >
                <div className='flex gap-2 items-center border-b border-border p-2 pb-2'>
                    <TerminalSquare />

                    <div className='flex flex-1 items-center justify-between'>
                        <TabsList className='h-9 space-x-1 bg-transparent p-0'>
                            {Object.keys(getCommands(command)).map((c) => (
                                <TabsTrigger
                                    value={c}
                                    key={c}
                                    className='data-[state=active]:bg-muted h-7 data-[state=active]:text-foreground rounded-md p-2 text-xs font-medium transition-all'
                                >
                                    {c}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <CopyButton value={getCommands(command)[value]} />

                        {/* <Button
                            variant='ghost'
                            size='icon'
                            onClick={handleCopy}
                            title='Copy command'
                            className='h-7 w-7 text-muted-foreground hover:text-foreground'
                        >
                            <Clipboard className='h-4 w-4' />
                            <span className='sr-only'>Copy command</span>
                        </Button> */}
                    </div>
                </div>

                {Object.entries(getCommands(command)).map(([key, cmd]) => (
                    <TabsContent key={key} value={key}>
                        <pre className='rounded-md p-3 text-sm font-mono text-muted-foreground'>
                            {cmd}
                        </pre>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

interface InstallTabsProps {
    pkg: string | string[]
    external?: boolean
}

export default InstallTabs
