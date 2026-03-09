import { COMPONENT_CATALOG } from "@/lib/builder/builder-prompt";

interface ParsedImports {
  solComponents: string[];
  installCommand: string;
}

/**
 * Extracts SolanaUI component names from generated code by matching
 * import statements against the known component catalog.
 */
const parseImports = (code: string): ParsedImports => {
  const importRegex =
    /import\s+\{[^}]+\}\s+from\s+["']@\/components\/sol\/([^"']+)["']/g;
  const matches = new Set<string>();

  for (const match of code.matchAll(importRegex)) {
    const fileName = match[1];
    const component = COMPONENT_CATALOG.find((c) => c.file === fileName);
    if (component) {
      matches.add(component.file);
    }
  }

  const solComponents = Array.from(matches).sort();

  const installCommand =
    solComponents.length > 0
      ? `pnpm dlx shadcn@latest add ${solComponents.map((c) => `@solanaui/${c}`).join(" ")}`
      : "";

  return { solComponents, installCommand };
};

export { parseImports };
export type { ParsedImports };
