import { scanOnePackage } from "../core";
import type { ScanResult } from "../types"; 

//function for throttling requests to the npm registry 


export const throttleRequests = async (
  allDeps: Record<string, string>
): Promise<ScanResult[]> => {
  const results: ScanResult[] = [];
  const THROTTLE_LIMIT = 3;
  const depsArr = Object.entries(allDeps).map(([name, version]) => {
    return { name, version };
  });
  for (let i = 0; i < depsArr.length; i += THROTTLE_LIMIT) {
    const curr = depsArr.slice(i, i + THROTTLE_LIMIT);
    const currPromises = curr.map((curr) => {
      return scanOnePackage(curr.name, curr.version);
    });
    const batchResults = await Promise.all(currPromises); 
    results.push(...batchResults); 
    //sleep for some delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  } 
  return results;
 };