import type * as React from "react";

import { type TypeNode, TypeTable } from "fumadocs-ui/components/type-table";

import { Index } from "@/registry/__index__";

const PropsTable: React.FC<PropsTableProps> = ({ filename, ...props }) => {
    const meta = Index[filename];

    if (
        meta?.meta?.api &&
        typeof meta.meta.api === "object" &&
        Object.keys(meta.meta.api).length > 0
    ) {
        return <TypeTable type={meta.meta.api as Record<string, TypeNode>} />;
    }

    return <div>{props.message || `No props found for ${props.name}`}</div>;
};

interface PropsTableProps {
    /** Name of the TS interface to generate the table from */
    name: string;
    /** Name of the file to generate the table from */
    filename: string;
    message?: string;
}

export { PropsTable };
