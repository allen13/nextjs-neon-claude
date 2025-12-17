// Main hook runner
export { hook } from "./hook";
// Notifications
export { notify } from "./notify";
// Response helpers
export { approve, block, context, deny, stop } from "./responses";
export type { SDLCResult } from "./sdlc";

// SDLC utilities
export {
  formatResults,
  hasDeployIntent,
  isSourceFile,
  isTestFile,
  runAllChecks,
  runBuild,
  runFormat,
  runLint,
  runTests,
  runTypeCheck,
} from "./sdlc";
// Types
export type {
  BashToolInput,
  EditToolInput,
  HookEvent,
  HookInput,
  HookInputBase,
  HookInputFor,
  HookOutput,
  NotificationInput,
  PermissionRequestInput,
  PostToolUseInput,
  PreCompactInput,
  PreToolUseInput,
  ReadToolInput,
  SessionEndInput,
  SessionStartInput,
  StopInput,
  SubagentStopInput,
  UserPromptSubmitInput,
  WriteToolInput,
} from "./types";
// Utilities
export {
  envFile,
  getCommand,
  getContent,
  getFilename,
  getFilePath,
  isFileWriteTool,
  isRemote,
  projectDir,
  projectPath,
  runCommand,
  runScript,
} from "./utils";
