import * as TabsComponents from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { Suspense, lazy } from 'react'

import { ComponentPreview } from '@/components/ComponentPreview'
import { ComponentSource } from '@/components/ComponentSource'
import { InstalationDocs } from '@/components/InstalationDocs'

const LazyPropsTable = lazy(() =>
    import('@/components/PropsTable').then((module) => ({
        default: module.PropsTable,
    }))
)

const PropsTableWithSuspense = (props: any) => (
    <Suspense
        fallback={<div className='animate-pulse bg-muted h-32 rounded-md' />}
    >
        <LazyPropsTable {...props} />
    </Suspense>
)

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        ...components,
        ...TabsComponents,
        ComponentPreview,
        ComponentSource,
        InstalationDocs,
        PropsTable: PropsTableWithSuspense,
    }
}
