import path from "path";
import { readdir, readFile } from "fs/promises";

export const getPackageJsonFile = async (): Promise<string | null> => {
  const currentPath = process.cwd();

  try {
    const files = await readdir(currentPath);

    if (!files.includes("package.json")) {
      console.log("❌ package.json not found");
      return null;
    }

    
    const fullPath = path.join(currentPath, "package.json");

    const fileContent = await readFile(fullPath, "utf-8");

    return fileContent;

  } catch (err) {
    console.error(" Something went wrong:", err);
    return null;
  }
};