import { promises as fs } from "fs"
import path from "path"

// Registry index for components
export const Index: Record<string, { component: React.ComponentType<any>; files: Array<{ path: string; content?: string }> }> = {
  "action-button": {
    component: require("@/registry/new-york/components/action-button/action-button").default,
    files: [
      {
        path: "registry/new-york/components/action-button/action-button.tsx",
      },
    ],
  },
}

export async function getRegistryItem(name: string) {
  const item = Index[name]

  if (!item) {
    return null
  }

  let files: Array<{ path: string; content: string }> = []
  for (const file of item.files) {
    try {
      const content = await fs.readFile(file.path, "utf-8")
      files.push({
        path: file.path,
        content,
      })
    } catch (error) {
      console.error(`Failed to read file ${file.path}:`, error)
    }
  }

  return {
    ...item,
    files,
  }
}

export function fixImport(content: string) {
  // Fix imports to match your project structure
  return content
    .replaceAll("@/registry/new-york/", "@/registry/new-york/")
    .replaceAll("export default", "export")
}
