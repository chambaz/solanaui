const fs = require("fs");
const path = require("path");
const glob = require("glob");

const SOURCE_DIR = "./src/components/sol";
const OUTPUT_DIR = "./src/generated/component-sources";

const files = glob.sync(`${SOURCE_DIR}/**/*.tsx`);

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

files.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");

  // Extract just the filename without the path
  const filename = path.basename(filePath);
  // Create the output path directly in the output directory
  const outputPath = path.join(OUTPUT_DIR, filename + ".txt");

  fs.writeFileSync(outputPath, content);
  console.log(`Generated: ${outputPath}`);
});
