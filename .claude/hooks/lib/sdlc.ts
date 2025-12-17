import { runCommand, runScript } from "./utils";

/**
 * Result of an SDLC phase execution
 */
export interface SDLCResult {
  passed: boolean;
  phase: string;
  output: string;
  duration: number;
}

/**
 * Run the Biome linter
 */
export async function runLint(): Promise<SDLCResult> {
  const start = Date.now();
  const result = await runScript("lint");
  return {
    passed: result.exitCode === 0,
    phase: "lint",
    output: result.stdout || result.stderr,
    duration: Date.now() - start,
  };
}

/**
 * Run TypeScript type checking
 */
export async function runTypeCheck(): Promise<SDLCResult> {
  const start = Date.now();
  const result = await runCommand(["bunx", "tsc", "--noEmit"]);
  return {
    passed: result.exitCode === 0,
    phase: "typecheck",
    output: result.stdout || result.stderr,
    duration: Date.now() - start,
  };
}

/**
 * Run production build
 */
export async function runBuild(): Promise<SDLCResult> {
  const start = Date.now();
  const result = await runScript("build");
  return {
    passed: result.exitCode === 0,
    phase: "build",
    output: result.stdout || result.stderr,
    duration: Date.now() - start,
  };
}

/**
 * Run tests (optionally for a specific file)
 */
export async function runTests(file?: string): Promise<SDLCResult> {
  const start = Date.now();
  const command = file ? ["bun", "test", file] : ["bun", "test"];
  const result = await runCommand(command);
  return {
    passed: result.exitCode === 0,
    phase: "test",
    output: result.stdout || result.stderr,
    duration: Date.now() - start,
  };
}

/**
 * Run Biome formatter
 */
export async function runFormat(): Promise<SDLCResult> {
  const start = Date.now();
  const result = await runScript("format");
  return {
    passed: result.exitCode === 0,
    phase: "format",
    output: result.stdout || result.stderr,
    duration: Date.now() - start,
  };
}

/**
 * Run all SDLC checks in sequence
 */
export async function runAllChecks(): Promise<SDLCResult[]> {
  const results: SDLCResult[] = [];

  // Run in sequence, stop on first failure
  const checks = [runLint, runTypeCheck, runBuild, runTests];

  for (const check of checks) {
    const result = await check();
    results.push(result);
    if (!result.passed) {
      break;
    }
  }

  return results;
}

/**
 * Format SDLC results for display
 */
export function formatResults(results: SDLCResult[]): string {
  const lines: string[] = [];

  for (const result of results) {
    const status = result.passed ? "PASS" : "FAIL";
    const duration = `${result.duration}ms`;
    lines.push(`[${status}] ${result.phase} (${duration})`);

    if (!result.passed && result.output) {
      lines.push(result.output.trim());
    }
  }

  return lines.join("\n");
}

/**
 * Check if a file path is a test file
 */
export function isTestFile(filePath: string): boolean {
  const filename = filePath.split("/").pop() ?? "";

  // Match common test file patterns
  const testPatterns = [/\.test\.[jt]sx?$/, /\.spec\.[jt]sx?$/, /__tests__\//];

  return testPatterns.some(
    (pattern) => pattern.test(filePath) || pattern.test(filename),
  );
}

/**
 * Check if file is a source file that should trigger formatting
 */
export function isSourceFile(filePath: string): boolean {
  const sourceExtensions = [".ts", ".tsx", ".js", ".jsx", ".json", ".css"];
  return sourceExtensions.some((ext) => filePath.endsWith(ext));
}

/**
 * Detect deploy intent in user prompt
 */
export function hasDeployIntent(prompt: string): boolean {
  const deployPatterns = [
    /\bdeploy\b/i,
    /\bpush\s+to\s+(prod|production)\b/i,
    /\brelease\b/i,
    /\bship\s+(it|this)?\b/i,
    /\bgo\s+live\b/i,
    /\bpublish\b/i,
  ];

  return deployPatterns.some((pattern) => pattern.test(prompt));
}
