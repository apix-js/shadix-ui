'use client'

import * as React from 'react'

import { CheckIcon, ClipboardIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/shadcn/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/shadcn/components/ui/tooltip'
import { cn } from '@/shadcn/lib/utils'

export function CopyButton({
    value,
    className,
    variant = 'ghost',
    ...props
}: React.ComponentProps<typeof Button> & {
    value: string
}) {
    const [hasCopied, setHasCopied] = React.useState(false)

    React.useEffect(() => {
        if (hasCopied) {
            const timer = setTimeout(() => {
                setHasCopied(false)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [hasCopied])

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size='icon'
                    variant={variant}
                    className={cn(
                        'absolute top-3 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100',
                        className
                    )}
                    onClick={() => {
                        navigator.clipboard.writeText(value)
                        setHasCopied(true)
                        toast.success('Copied to clipboard')
                    }}
                    {...props}
                >
                    <span className='sr-only'>Copy</span>
                    {hasCopied ? (
                        <CheckIcon className='h-4 w-4' />
                    ) : (
                        <ClipboardIcon className='h-4 w-4' />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
        </Tooltip>
    )
}
