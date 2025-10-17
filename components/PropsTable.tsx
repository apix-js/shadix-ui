import * as React from 'react'
import { TypeTable } from 'fumadocs-ui/components/type-table'

import { Index } from '@/registry/__index__'

const PropsTable: React.FC<PropsTableProps> = ({ filename, ...props }) => {
    const meta = Index[filename]

    const filePath = './' + meta?.files?.[0]?.path
    // feat: Use pre-extracted props in TypeTable format (fastest approach)
    if (meta?.meta?.api && typeof meta.meta.api === 'object') {
        return <TypeTable type={meta.meta.api as Record<string, any>} />
    }

    return <div>No props found for {props.name}</div>
}

interface PropsTableProps {
    /** Name of the TS interface to generate the table from */
    name: string
    /** Name of the file to generate the table from */
    filename: string
}

export { PropsTable }
