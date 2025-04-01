"use server";

import { promises as fs } from "fs";
import path from "path";

export async function getComponentSource(componentPath: string) {
  try {
    // According to Vercel's documentation, process.cwd() should be used
    // to determine the current directory of the Vercel Function
    const fullPath = path.join(process.cwd(), componentPath);
    
    // Log for debugging
    console.log(`Attempting to read file at: ${fullPath}`);
    
    // Read the file
    const contents = await fs.readFile(fullPath, "utf8");
    console.log(`Successfully read file: ${componentPath}`);
    
    return contents;
  } catch (error) {
    console.error(`Error reading component source for ${componentPath}:`, error);
    return "";
  }
}
