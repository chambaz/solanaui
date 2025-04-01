"use server";

import { promises as fs } from "fs";
import path from "path";

export async function getComponentSource(componentPath: string) {
  console.log("getComponentSource called with path:", componentPath);
  
  try {
    // Check if we're in a Vercel serverless environment
    const isVercel = process.env.VERCEL === "1";
    console.log("Environment:", isVercel ? "Vercel" : "Local");
    console.log("Current working directory:", process.cwd());
    
    // Try to list the contents of the directories to see what's available
    try {
      if (isVercel) {
        console.log("Listing /var/task contents:");
        const taskContents = await fs.readdir("/var/task", { withFileTypes: true });
        console.log(taskContents.map(dirent => `${dirent.name} ${dirent.isDirectory() ? '(dir)' : '(file)'}`));
        
        if (taskContents.some(dirent => dirent.name === "src" && dirent.isDirectory())) {
          console.log("Listing /var/task/src contents:");
          const srcContents = await fs.readdir("/var/task/src", { withFileTypes: true });
          console.log(srcContents.map(dirent => `${dirent.name} ${dirent.isDirectory() ? '(dir)' : '(file)'}`));
          
          if (srcContents.some(dirent => dirent.name === "components" && dirent.isDirectory())) {
            console.log("Listing /var/task/src/components contents:");
            const componentsContents = await fs.readdir("/var/task/src/components", { withFileTypes: true });
            console.log(componentsContents.map(dirent => `${dirent.name} ${dirent.isDirectory() ? '(dir)' : '(file)'}`));
            
            if (componentsContents.some(dirent => dirent.name === "sol" && dirent.isDirectory())) {
              console.log("Listing /var/task/src/components/sol contents:");
              const solContents = await fs.readdir("/var/task/src/components/sol", { withFileTypes: true });
              console.log(solContents.map(dirent => `${dirent.name} ${dirent.isDirectory() ? '(file)' : '(file)'}`));
            }
          }
        }
      } else {
        // In local development, just list the components directory
        const componentsPath = path.join(process.cwd(), "src/components/sol");
        console.log(`Listing ${componentsPath} contents:`);
        const contents = await fs.readdir(componentsPath, { withFileTypes: true });
        console.log(contents.map(dirent => `${dirent.name} ${dirent.isDirectory() ? '(dir)' : '(file)'}`));
      }
    } catch (dirError) {
      console.error("Error listing directories:", dirError);
    }
    
    // Try multiple possible paths
    const possiblePaths = isVercel 
      ? [
          // Standard path with src prefix removed
          path.join("/var/task/src", componentPath.replace(/^src\//, "")),
          // Try with .tsx extension if not provided
          path.join("/var/task/src", componentPath.replace(/^src\//, "")) + (componentPath.endsWith(".tsx") ? "" : ".tsx"),
          // Try with full path as is
          path.join("/var/task", componentPath),
          // Try with just the filename
          path.join("/var/task/src/components/sol", path.basename(componentPath))
        ]
      : [
          // Local development - use process.cwd() as before
          path.join(process.cwd(), componentPath)
        ];
    
    console.log("Trying the following paths:");
    possiblePaths.forEach(p => console.log(`- ${p}`));
    
    // Try each path
    let contents = "";
    let lastError = null;
    
    for (const fullPath of possiblePaths) {
      try {
        // Check if file exists before trying to read it
        await fs.access(fullPath);
        console.log(`File exists at path: ${fullPath}`);
        
        contents = await fs.readFile(fullPath, "utf8");
        console.log(`Successfully read file from: ${fullPath}`);
        return contents;
      } catch (err) {
        console.log(`Failed to read from path: ${fullPath}`, (err as { code?: string }).code);
        lastError = err;
      }
    }
    
    // If we get here, all paths failed
    throw lastError || new Error(`Could not find file at any of the attempted paths`);
  } catch (error) {
    console.error("Error reading component source:", error, {
      cwd: process.cwd(),
      env: process.env.VERCEL ? "Vercel" : "Local",
      path: componentPath
    });
    
    // Return a helpful message instead of an empty string
    return `// Could not load source code for ${componentPath}\n// This is likely because the file structure in the deployment environment differs from local development.\n// Please check the server logs for more details.`;
  }
}
