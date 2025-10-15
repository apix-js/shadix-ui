import { createRelativeLink } from 'fumadocs-ui/mdx'
import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle,
} from 'fumadocs-ui/page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPageImage, source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'
import { findNeighbour } from 'fumadocs-core/page-tree'
import { Button } from '@/shadcn/components/ui/button'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { AIOpenButton } from '@/components/AIOpenButton'
import { getAbsoluteUrl } from '@/lib/utils'

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
    const params = await props.params
    const page = source.getPage(params.slug)
    if (!page) notFound()

    const MDX = page.data.body
    const neighbours = await findNeighbour(source.pageTree, page.url)

    return (
        <DocsPage
            toc={page.data.toc}
            tableOfContent={{
                enabled: true,
                style: 'clerk',
            }}
            tableOfContentPopover={{
                style: 'clerk',
            }}
            full={page.data.full}
        >
            <div className='flex items-center gap-2 justify-between'>
                <DocsTitle className='flex-1 text-4xl text-foreground'>
                    {page.data.title}
                </DocsTitle>

                <div className='flex h-full items-center gap-2'>
                    <AIOpenButton url={getAbsoluteUrl(page.url)} />

                    {neighbours.previous && (
                        <Button
                            variant='secondary'
                            size='icon'
                            className='extend-touch-target ml-auto size-8 shadow-none md:size-7'
                            asChild
                        >
                            <Link href={neighbours.previous.url}>
                                <ArrowLeftIcon />
                                <span className='sr-only'>Previous</span>
                            </Link>
                        </Button>
                    )}

                    {neighbours.next && (
                        <Button
                            variant='secondary'
                            size='icon'
                            className='extend-touch-target size-8 shadow-none md:size-7'
                            asChild
                        >
                            <Link href={neighbours.next.url}>
                                <span className='sr-only'>Next</span>
                                <ArrowRightIcon />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <DocsDescription>{page.data.description}</DocsDescription>

            <DocsBody>
                <MDX
                    components={getMDXComponents({
                        // this allows you to link to other pages with relative file paths
                        a: createRelativeLink(source, page),
                    })}
                />
            </DocsBody>
        </DocsPage>
    )
}

export async function generateStaticParams() {
    return source.generateParams()
}

export async function generateMetadata(
    props: PageProps<'/docs/[[...slug]]'>
): Promise<Metadata> {
    const params = await props.params
    const page = source.getPage(params.slug)
    if (!page) notFound()

    return {
        title: page.data.title,
        description: page.data.description,
        openGraph: {
            images: getPageImage(page).url,
        },
    }
}
