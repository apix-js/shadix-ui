import * as TabsComponents from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

import { ComponentPreview } from '@/components/ComponentPreview'
import { ComponentSource } from '@/components/ComponentSource'
import { InstalationDocs } from '@/components/InstalationDocs'
import { PropsTable } from '@/components/PropsTable'

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        ...components,
        ...TabsComponents,
        ComponentPreview,
        ComponentSource,
        InstalationDocs,
        PropsTable,
    }
}
