"use server";

import { promises as fs } from "fs";
import path from "path";

export async function getComponentSource(componentPath: string) {
  try {
    const fullPath = path.join(process.cwd(), componentPath);
    const contents = await fs.readFile(fullPath, "utf8");
    return contents;
  } catch (error) {
    console.error("Error reading component source:", error);
    return "";
  }
}
