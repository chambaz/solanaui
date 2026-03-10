const fs = require("fs");
const path = require("path");
const glob = require("glob");

const COMPONENT_SOURCE_DIR = "./src/components/sol";
const UTILITY_SOURCE_DIRS = [
  "./src/lib/assets/**/*.ts",
  "./src/lib/prices/**/*.ts",
  "./src/lib/utils.ts",
];
const OUTPUT_DIR = "./public/generated/component-sources";

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Process component files
const componentFiles = glob.sync(`${COMPONENT_SOURCE_DIR}/**/*.tsx`);

componentFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");

  // Extract just the filename without the path
  const filename = path.basename(filePath);
  // Create the output path directly in the output directory
  const outputPath = path.join(OUTPUT_DIR, filename + ".txt");

  fs.writeFileSync(outputPath, content);
  console.log(`Generated component: ${outputPath}`);
});

// Process utility files
UTILITY_SOURCE_DIRS.forEach((pattern) => {
  const utilityFiles = glob.sync(pattern);

  utilityFiles.forEach((filePath) => {
    const content = fs.readFileSync(filePath, "utf-8");

    // Get just the relative path without the ./src/lib/ prefix
    const relPath = filePath.replace(/^\.\/src\/lib\//, "");
    // Create a flat filename with underscores instead of slashes
    const flatFilename = relPath.replace(/\//g, "_");
    // Remove any src_lib_ prefix that might have been added
    const cleanFilename = flatFilename.replace(/^src_lib_/, "");
    const outputPath = path.join(OUTPUT_DIR, cleanFilename + ".txt");

    fs.writeFileSync(outputPath, content);
    console.log(`Generated utility: ${outputPath}`);
  });
});
