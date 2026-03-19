#!/usr/bin/env bun
import { getPackageJsonFile } from "./utils/getPackageJsonFile";
import { scanPackageJson } from "./core"; 

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("No arguments provided\n");
    console.log("Use 'scan' to scan dependencies or 'help' for usage");
    return;
  }

  if (args[0] === "scan") {
    const fileContent = await getPackageJsonFile();

    if (!fileContent) {
      console.log("❌ No package.json found in current directory");
      return;
    }

    let json;

    try {
      json = JSON.parse(fileContent);
    } catch (err) {
      console.log("❌ Invalid package.json format");
      return;
    }

    await scanPackageJson(json);

  } else if (args[0] === "help") {

    console.log(`
Usage:
  pkg-sniffer scan      Scan dependencies
  pkg-sniffer help      Show help

Example:
  pkg-sniffer scan
    `);

  } else {
    console.log("❌ Command not found !!\n");
    console.log("Use 'help' to see available commands");
    return;
  }
};

main();
