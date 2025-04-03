"use server";

import { promises as fs } from "fs";
import path from "path";

export async function getComponentSource(componentPath: string) {
  try {
    const contents = await fs.readFile(
      path.join(process.cwd(), componentPath),
      "utf8",
    );
    console.log(`Successfully read file: ${componentPath}`);

    return contents;
  } catch (error) {
    console.error(
      `Error reading component source for ${componentPath}:`,
      error,
    );
    return "";
  }
}
