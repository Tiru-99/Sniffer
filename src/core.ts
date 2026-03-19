import axios from "axios";
import ora from "ora";

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type ScanResult = {
  name: string;
  version: string;
  maintainers?: number;
  downloads?: number;
  error?: boolean;
  type?: "SUSPICIOUS" | "WARNING" | "SAFE";
  reason?: string;
};


export const scanPackageJson = async (fileContent: PackageJson) => {
  const spinner = ora("🔍 Scanning dependencies...").start();

  const allDeps = {
    ...fileContent.dependencies,
    ...fileContent.devDependencies
  };

  try {
    const results = await Promise.all(
      Object.entries(allDeps).map(([name, version]) =>
        scanOnePackage(name, version)
      )
    );

    spinner.succeed("Scan completed");

    const flagged = results.filter((pkg) => pkg.type !== "SAFE");

    console.log("\n🔍 Scan Results:\n");

    if (flagged.length === 0) {
      console.log("✅ No suspicious packages found");
      return;
    }

    console.log(
      "⚠️ Suspicious packages detected — please review them before proceeding.\n"
    );

    flagged.forEach((pkg, i) => {
      console.log(`🚨 ${i + 1}. ${pkg.name}@${pkg.version}`);

      if (pkg.error) {
        console.log(
          "   - Failed to fetch package info — be careful before using this package"
        );
      } else {
        console.log(`   - Downloads: ${pkg.downloads}`);
        console.log(`   - Maintainers: ${pkg.maintainers}`);
      }

      if (pkg.reason) {
        console.log(`   - Reason: ${pkg.reason}`);
      }

      console.log("");
    });
  } catch (err) {
    spinner.fail("Scan failed");
    console.error(err);
  }
};

export const scanOnePackage = async (
  name: string,
  version: string
): Promise<ScanResult> => {
  try {
    // security placeholder
    if (version.includes("security")) {
      return {
        name,
        version,
        type: "WARNING",
        reason: "Security placeholder package — not meant for use"
      };
    }

    const [metaRes, downloadRes] = await Promise.all([
      axios.get(`https://registry.npmjs.org/${name}/latest`),
      axios.get(`https://api.npmjs.org/downloads/point/last-week/${name}`)
    ]);

    const maintainers = metaRes.data.maintainers?.length || 0;
    const downloads = downloadRes.data.downloads || 0;

    const isLowDownloads = downloads < 100;
    const isLowMaintainer = maintainers <= 1 && downloads < 1000;

    if (isLowDownloads || isLowMaintainer) {
      return {
        name,
        version,
        maintainers,
        downloads,
        type: "SUSPICIOUS",
        reason: "Low trust signals (low downloads / few maintainers)"
      };
    }

    return {
      name,
      version,
      maintainers,
      downloads,
      type: "SAFE"
    };
  } catch (err) {
    return {
      name,
      version,
      error: true,
      type: "SUSPICIOUS",
      reason: "Failed to fetch package data"
    };
  }
};