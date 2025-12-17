import {
  block,
  context,
  getFilePath,
  hook,
  isFileWriteTool,
  isSourceFile,
  isTestFile,
  runFormat,
  runTests,
} from "./lib";

hook("PostToolUse", async (input) => {
  // Only process file write operations
  if (!isFileWriteTool(input.tool_name)) {
    return;
  }

  const filePath = getFilePath(input);
  if (!filePath) {
    return;
  }

  const results: string[] = [];

  // Phase 1: Format source files
  if (isSourceFile(filePath)) {
    const formatResult = await runFormat();
    if (!formatResult.passed) {
      return block(`Formatting failed:\n${formatResult.output}`);
    }
    results.push(`[format] ${formatResult.duration}ms`);
  }

  // Phase 2: Run tests if test file was modified
  if (isTestFile(filePath)) {
    const testResult = await runTests(filePath);
    if (!testResult.passed) {
      return block(`Tests failed:\n${testResult.output}`);
    }
    results.push(`[test] ${testResult.duration}ms`);
  }

  // Return context with results
  if (results.length > 0) {
    return context(results.join(" | "));
  }
});
