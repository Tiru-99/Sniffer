export type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export type ScanResult = {
  name: string;
  version: string;
  maintainers?: number;
  downloads?: number;
  error?: boolean;
  type?: "SUSPICIOUS" | "WARNING" | "SAFE";
  reason?: string;
};