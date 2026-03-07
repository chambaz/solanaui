import fs from "node:fs";
import path from "node:path";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

interface ComponentCodeProps {
  name: string;
}

const ComponentCode = ({ name }: ComponentCodeProps) => {
  // Convert kebab-case to filename (e.g., "auth-dialog" -> "auth-dialog.tsx")
  const fileName = `${name}.tsx`;

  // Resolve the absolute path to the component file
  const filePath = path.join(
    process.cwd(),
    "src",
    "components",
    "sol",
    fileName,
  );

  // Read the file synchronously at build time
  let code: string;
  try {
    code = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Failed to read component file: ${filePath}`, error);
    return (
      <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-red-900 dark:bg-red-950 dark:text-red-100">
        <p className="font-semibold">Error loading component code</p>
        <p className="text-sm">Could not find: {fileName}</p>
      </div>
    );
  }

  return (
    <DynamicCodeBlock
      lang="tsx"
      code={code}
      options={{
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      }}
    ></DynamicCodeBlock>
  );
};

export { ComponentCode };
