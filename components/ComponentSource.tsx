import * as React from 'react'
import { cn } from '@/shadcn/lib/utils'
import { highlightCode } from '@/lib/highlight-code'
import { getRegistryItem } from '@/lib/registry'
import { CopyButton } from '@/components/CopyButton'

export async function ComponentSource({
    name,
    src,
    title,
    language,
    collapsible = true,
    className,
}: React.ComponentProps<'div'> & {
    name?: string
    src?: string
    title?: string
    language?: string
    collapsible?: boolean
}) {
    if (!name && !src) {
        return null
    }

    let code: string | undefined

    if (name) {
        const item = await getRegistryItem(name)
        code = item?.files?.[0]?.content
    }

    if (!code) {
        return null
    }

    // Fix imports
    code = code.replaceAll('@/registry/new-york/', '@/registry/new-york/')
    code = code.replaceAll('export default', 'export')

    const lang = language ?? title?.split('.').pop() ?? 'tsx'
    const highlightedCode = await highlightCode(code, lang)

    if (!collapsible) {
        return (
            <div className={cn('relative', className)}>
                <ComponentCode code={code} highlightedCode={highlightedCode} language={lang} title={title} />
            </div>
        )
    }

    return (
        <div className={className}>
            <ComponentCode code={code} highlightedCode={highlightedCode} language={lang} title={title} />
        </div>
    )
}

function ComponentCode({
    code,
    highlightedCode,
    language,
    title,
}: {
    code: string
    highlightedCode: string
    language: string
    title: string | undefined
}) {
    return (
        <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
            {title && (
                <figcaption
                    data-rehype-pretty-code-title=""
                    className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
                    data-language={language}
                >
                    {/* {getIconForLanguageExtension(language)} */}
                    {title}
                </figcaption>
            )}
            <CopyButton value={code} />
            <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </figure>
    )
}
