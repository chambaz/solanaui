"use server";

import { promises as fs } from "fs";
import path from "path";

export async function getComponentSource(componentPath: string) {
  try {
    // Check if we're in a Vercel serverless environment
    const isVercel = process.env.VERCEL === "1";

    let fullPath;
    if (isVercel) {
      // In Vercel serverless functions, the code is in /var/task
      fullPath = path.join("/var/task", componentPath);
    } else {
      // Local development - use process.cwd() as before
      fullPath = path.join(process.cwd(), componentPath);
    }

    const contents = await fs.readFile(fullPath, "utf8");
    return contents;
  } catch (error) {
    console.error("Error reading component source:", error, {
      cwd: process.cwd(),
      env: process.env.VERCEL ? "Vercel" : "Local",
      path: componentPath,
    });
    return "";
  }
}
