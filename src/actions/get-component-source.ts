"use server";

import { promises as fs } from "fs";
import path from "path";

// Global variable to store the successful path for logging
let SUCCESSFUL_PATH = "";

export async function getComponentSource(componentPath: string) {
  // For debugging - log the request
  console.log(`getComponentSource called with: ${componentPath}`);
  console.log(`Environment: ${process.env.VERCEL ? "Vercel" : "Local"}`);
  console.log(`CWD: ${process.cwd()}`);

  try {
    // Check if we're in a Vercel serverless environment
    const isVercel = process.env.VERCEL === "1";

    // Define all possible paths to try
    const possiblePaths = [];

    if (isVercel) {
      // Vercel paths - try multiple variations
      possiblePaths.push(
        // 1. Standard path with /var/task
        path.join("/var/task", componentPath),
        // 2. Path with /var/task/src and src/ prefix removed
        path.join("/var/task/src", componentPath.replace(/^src\//, "")),
        // 3. Path with just the filename in components/sol
        path.join("/var/task/src/components/sol", path.basename(componentPath)),
        // 4. Path with .next/server
        path.join("/var/task/.next/server", componentPath),
        // 5. Path with just cwd
        path.join(process.cwd(), componentPath),
      );
    } else {
      // Local development - just use process.cwd()
      possiblePaths.push(path.join(process.cwd(), componentPath));
    }

    // Log all paths we're going to try
    console.log("Trying paths:");
    possiblePaths.forEach((p) => console.log(`- ${p}`));

    // Try each path in sequence
    let lastError: unknown = null;

    for (const fullPath of possiblePaths) {
      try {
        // Check if file exists before trying to read it
        await fs.access(fullPath);
        console.log(`Success: Found file at ${fullPath}`);

        // Store the successful path for future reference
        SUCCESSFUL_PATH = fullPath;

        // Read and return the file contents
        const contents = await fs.readFile(fullPath, "utf8");

        // Log the successful path for this component
        console.log(`SUCCESS PATH FOR ${componentPath}: ${SUCCESSFUL_PATH}`);

        return contents;
      } catch (err) {
        // Store the error and continue to the next path
        lastError = err;
        console.log(
          `Failed: ${fullPath} - ${(err as { code?: string }).code || "unknown error"}`,
        );
      }
    }

    // If we get here, all paths failed
    throw lastError instanceof Error
      ? lastError
      : new Error("Could not find file at any of the attempted paths");
  } catch (error) {
    // Log the error with detailed information
    console.error("Error reading component source:", error);

    // Return empty string on failure
    return "";
  }
}
