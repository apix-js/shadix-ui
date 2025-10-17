import { promises as fs } from "node:fs";
import path from "node:path";
import { Project } from "ts-morph";

type RegistryIndexFile = {
    path: string;
    type: string;
    target?: string;
};

type RegistryIndexItem = {
    name: string;
    description?: string;
    type: string;
    registryDependencies?: string[];
    files: RegistryIndexFile[];
    component: string;
    categories?: string[];
    dependencies?: string[];
    meta?: Record<string, unknown>;
};

type RegistryItem = RegistryIndexItem;

type RegistryMeta = {
    $schema: string;
    name: string;
    displayName?: string;
    description?: string;
    homepage?: string;
    version?: string;
    items: RegistryItem[];
};

type TypeNode = {
    /** Additional description of the field */
    description?: string;
    /** type signature (short) */
    type: string;
    /** type signature (full) */
    typeDescription?: string;
    /** Optional href for the type */
    typeDescriptionLink?: string;
    default?: string;
    required?: boolean;
    deprecated?: boolean;
    parameters?: Array<{
        name: string;
        description: string;
    }>;
    returns?: string;
};

type PropsTableData = Record<string, TypeNode>;

const toPosix = (path: string): string => path.replaceAll("\\", "/");

const readJson = async <T>(file: string): Promise<T> => {
    const content = await fs.readFile(file, "utf8");
    return JSON.parse(content) as T;
};

const extractProps = (name: string, filePath: string): PropsTableData => {
    try {
        const project = new Project();
        const sourceFile = project.addSourceFileAtPath(filePath);

        const interfaceDeclaration = sourceFile.getInterface(name);
        if (!interfaceDeclaration) {
            console.warn(`Interface ${name} not found in ${filePath}`);
            return {} as PropsTableData;
        }

        const props: PropsTableData = {};

        for (const prop of interfaceDeclaration.getProperties()) {
            const jsDocTags = prop.getJsDocs();
            const hasPublicTag = jsDocTags.some((jsDoc) =>
                jsDoc.getTags().some((tag) => tag.getTagName() === "public"),
            );
            const hasInternalTag = jsDocTags.some((jsDoc) =>
                jsDoc.getTags().some((tag) => tag.getTagName() === "internal"),
            );

            if (
                hasPublicTag &&
                !hasInternalTag &&
                !isInheritedProp(prop.getName())
            ) {
                const comment = prop
                    .getJsDocs()[0]
                    .getInnerText()
                    .replace("@public", "")
                    .trim();
                const typeNode = prop.getTypeNode();
                const typeText =
                    typeNode?.getText().replaceAll("\n", "").trim() ??
                    "unknown";

                const parameters: Array<{ name: string; description: string }> =
                    [];
                const paramTags = jsDocTags.filter((jsDoc) =>
                    jsDoc.getTags().some((tag) => tag.getTagName() === "param"),
                );

                for (const paramTag of paramTags) {
                    const paramComment = paramTag
                        .getInnerText()
                        .replace("@param", "")
                        .trim();
                    if (paramComment) {
                        const match = paramComment.match(/^(\w+)\s*-\s*(.*)$/);
                        if (match) {
                            parameters.push({
                                name: match[1],
                                description: match[2].trim(),
                            });
                        }
                    }
                }

                const returnTag = jsDocTags.find((jsDoc) =>
                    jsDoc
                        .getTags()
                        .some((tag) => tag.getTagName() === "returns"),
                );
                const returns = returnTag
                    ?.getInnerText()
                    .replace("@returns", "")
                    .trim();

                const isDeprecated = jsDocTags.some((jsDoc) =>
                    jsDoc
                        .getTags()
                        .some((tag) => tag.getTagName() === "deprecated"),
                );

                const defaultTag = jsDocTags.find((jsDoc) =>
                    jsDoc
                        .getTags()
                        .some((tag) => tag.getTagName() === "default"),
                );
                const defaultValue = defaultTag
                    ?.getInnerText()
                    .replace("@default", "")
                    .trim();

                props[prop.getName()] = {
                    description: comment,
                    type: typeText,
                    typeDescription: typeText,
                    required: !prop.hasQuestionToken(),
                    deprecated: isDeprecated,
                    parameters: parameters.length > 0 ? parameters : undefined,
                    returns: returns || undefined,
                    default: defaultValue || undefined,
                };
            }
        }

        console.log(props);

        return props;
    } catch (error) {
        console.error(
            `Error extracting props for ${name} from ${filePath}:`,
            error,
        );
        return {} as PropsTableData;
    }
};

const isInheritedProp = (propName: string): boolean => {
    const inheritedProps = [
        "key",
        "ref",
        "onMouseEnter",
        "onMouseLeave",
        "onFocus",
        "onBlur",
        "disabled",
        "role",
        "tabIndex",
    ];

    return (
        inheritedProps.includes(propName) ||
        propName.startsWith("aria-") ||
        propName.startsWith("data-")
    );
};

const generateInterfaceName = (componentName: string): string => {
    return `${componentName
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")}Props`;
};

const recursiveFilesList = async (
    rootDir: string,
    exts: string[],
): Promise<string[]> => {
    const results: string[] = [];

    const walk = async (current: string): Promise<void> => {
        let entries: import("node:fs").Dirent[];

        try {
            entries = await fs.readdir(current, { withFileTypes: true });
        } catch {
            return;
        }

        for (const entry of entries) {
            const abs = path.join(current, entry.name);
            if (entry.isDirectory()) {
                await walk(abs);
                continue;
            }

            if (entry.isFile()) {
                const matches = exts.some((ext) =>
                    entry.name
                        .toLocaleLowerCase()
                        .endsWith(ext.toLocaleLowerCase()),
                );
                if (matches) {
                    results.push(abs);
                }
            }
        }
    };

    await walk(rootDir);

    return results;
};

const createTSXLazyComponent = (
    importPath: string,
    fallbackName: string,
): string => {
    // TSX expression string that will be embedded in the generated file
    return `React.lazy(async () => {
    const mod = await import("${importPath}")
    const exportName = Object.keys(mod).find(key => typeof (mod as Record<string, unknown>)[key] === "function" || typeof (mod as Record<string, unknown>)[key] === "object") || "${fallbackName}"
    return { default: (mod as Record<string, unknown>)[exportName] as React.ComponentType<object> }
  })`;
};

const main = async (): Promise<void> => {
    const rootDir = process.cwd();
    const registryJsonPath = path.join(rootDir, "registry.json");
    const registryDir = path.join(rootDir, "registry");

    const styleFolder = "new-york";
    const stylePrefix = `registry/${styleFolder}`;
    const exampleDir = path.join(rootDir, stylePrefix, "demos");

    const meta = await readJson<RegistryMeta>(registryJsonPath);

    // Collect entries from registry.json
    const entries = new Map<string, RegistryIndexItem>();

    for (const item of meta.items) {
        const filesMeta = (item.files ?? []).map((file) => ({
            path: toPosix(`${file.path}`),
            type: file.type,
            target: file.target ?? "",
        }));

        const firstImport = item.files?.[0]?.path
            ? `@/${toPosix(item.files?.[0]?.path)}`
            : "";

        const component = firstImport
            ? createTSXLazyComponent(firstImport, item.name)
            : "null";

        const componentPath = item.files?.[0]?.path;
        let extractedProps: PropsTableData = {};

        if (componentPath) {
            const fullPath = path.join(rootDir, componentPath);
            const interfaceName = generateInterfaceName(item.name);
            extractedProps = extractProps(interfaceName, fullPath);
        }

        const record: RegistryIndexItem = {
            name: item.name,
            description: item.description ?? "",
            type: item.type,
            registryDependencies: item.registryDependencies,
            dependencies: item.dependencies,
            files: filesMeta,
            component: component,
            categories: item.categories,
            meta: {
                api: extractedProps,
            },
        };

        entries.set(item.name, record);
    }

    // Collect examples from registry/new-york/demos
    const exampleFiles = await recursiveFilesList(exampleDir, [".tsx", ".jsx"]);
    for (const filePath of exampleFiles) {
        const relPath = toPosix(path.relative(rootDir, filePath)); // registry/new-york/demos/[fileName].demo.tsx
        const fileName = path
            .basename(relPath)
            .replace(/\.(tsx|jsx)$/i, "")
            .replace(/.demo$/i, "-demo");

        // avoid duplicates or overwrite
        if (entries.has(fileName)) continue;

        const entry: RegistryIndexItem = {
            name: fileName,
            type: "registry:demo",
            files: [
                {
                    path: relPath,
                    type: "registry:demo",
                    target: "",
                },
            ],
            component: createTSXLazyComponent(`@/${relPath}`, fileName),
        };

        entries.set(fileName, entry);
    }

    // Emit TSX file
    let out = `/* eslint-disable @typescript-eslint/ban-ts-comment */\n`;
    out += `/* eslint-disable @typescript-eslint/no-explicit-any */\n`;
    out += `// @ts-nocheck\n`;
    out += `// This file is autogenerated by scripts/build-registry.ts\n`;
    out += `// Do not edit this file directly.\n`;
    out += `import * as React from "react"\n\n`;

    out += `export type RegistryIndexFile = { path: string; type: string; target?: string; content?: string; githubUrl?: string }\n`;
    out += `export type RegistryIndexItem = {\n`;
    out += `  name: string\n`;
    out += `  description?: string\n`;
    out += `  type: string\n`;
    out += `  registryDependencies?: string[]\n`;
    out += `  files: RegistryIndexFile[]\n`;
    out += `  component: React.LazyExoticComponent<React.ComponentType<object>> | null\n`;
    out += `  dependencies?: string[]\n`;
    out += `  categories?: string[]\n`;
    out += `  meta?: Record<string, unknown>\n`;
    out += `}\n\n`;

    out += `export const Index: Record<string, RegistryIndexItem> = {\n`;

    for (const [key, item] of Array.from(entries.entries()).sort(([a], [b]) =>
        a.localeCompare(b),
    )) {
        const filesArray = `[${item.files
            .map(
                (f) =>
                    `{ path: "${f.path}", type: "${f.type}", target: "${
                        f.target ?? ""
                    }", githubUrl: "https://github.com/apix-js/shadix-ui/tree/main/${
                        f.path
                    }" }`,
            )
            .join(", ")}]`;

        out += `  "${key}": {\n`;
        out += `    name: ${JSON.stringify(item.name)},\n`;
        out += `    description: ${JSON.stringify(item.description ?? "")},\n`;
        out += `    type: ${JSON.stringify(item.type)},\n`;
        out += `    registryDependencies: ${JSON.stringify(
            item.registryDependencies,
        )},\n`;
        out += `    files: ${filesArray},\n`;
        out += `    component: ${item.component},\n`;
        out += `    dependencies: ${JSON.stringify(item.dependencies)},\n`;
        out += `    categories: ${JSON.stringify(item.categories)},\n`;
        out += `    meta: ${JSON.stringify(item.meta)},\n`;
        out += `  },\n`;
    }

    out += `}\n`;

    await fs.mkdir(registryDir, { recursive: true });
    await fs.writeFile(path.join(registryDir, "__index__.tsx"), out, "utf8");

    console.log("✅ Registry built successfully");
};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
