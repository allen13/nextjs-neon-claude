import type {
  BashToolInput,
  EditToolInput,
  PostToolUseInput,
  PreToolUseInput,
  WriteToolInput,
} from "./types";

// Environment variables
export const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
export const envFile = process.env.CLAUDE_ENV_FILE;
export const isRemote = process.env.CLAUDE_CODE_REMOTE === "true";

/**
 * Build a path relative to the project directory
 */
export function projectPath(...segments: string[]): string {
  return [projectDir, ...segments].join("/");
}

/**
 * Get file_path from Write or Edit tool input
 */
export function getFilePath(
  input: PreToolUseInput | PostToolUseInput,
): string | undefined {
  const toolInput = input.tool_input as Partial<WriteToolInput | EditToolInput>;
  return toolInput.file_path;
}

/**
 * Get content from Write tool input
 */
export function getContent(
  input: PreToolUseInput | PostToolUseInput,
): string | undefined {
  const toolInput = input.tool_input as Partial<WriteToolInput>;
  return toolInput.content;
}

/**
 * Get command from Bash tool input
 */
export function getCommand(
  input: PreToolUseInput | PostToolUseInput,
): string | undefined {
  const toolInput = input.tool_input as Partial<BashToolInput>;
  return toolInput.command;
}

/**
 * Get the filename from a file path
 */
export function getFilename(filePath: string): string {
  return filePath.split("/").pop() ?? "";
}

/**
 * Check if a tool is a file-writing tool
 */
export function isFileWriteTool(toolName: string): boolean {
  return toolName === "Write" || toolName === "Edit";
}

/**
 * Run a shell command and return the result
 */
export async function runCommand(
  command: string[],
  options?: { cwd?: string },
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const proc = Bun.spawn(command, {
    cwd: options?.cwd ?? projectDir,
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  return { exitCode, stdout, stderr };
}

/**
 * Run a package.json script via bun
 */
export async function runScript(
  scriptName: string,
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return runCommand(["bun", "run", scriptName]);
}
