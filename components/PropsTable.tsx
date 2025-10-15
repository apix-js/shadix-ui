import { Index } from '@/registry/__index__'
import * as React from 'react'
import { createGenerator } from 'fumadocs-typescript'
import { AutoTypeTable } from 'fumadocs-typescript/ui'

const genrator = createGenerator()

const PropsTable: React.FC<PropsTableProps> = ({ filename, ...props }) => {
    const meta = Index[filename]

    const filePath = './' + meta?.files?.[0]?.path

    if (!filePath) {
        return <div>No file path found for {props.name}</div>
    }

    // return <></>
    return <AutoTypeTable {...props} generator={genrator} path={filePath} />
}

interface PropsTableProps {
    /** Name of the TS interface to generate the table from */
    name: string
    /** Name of the file to generate the table from */
    filename: string
}

export { PropsTable }
