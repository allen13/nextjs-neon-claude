import type { HookOutput } from "./types";

/**
 * Block the operation and force Claude to address the issue.
 *
 * Use for: validation failures, lint errors, test failures, security violations.
 * Claude will see the reason and must fix the issue before continuing.
 *
 * @example
 * if (!result.passed) {
 *   return block(`Tests failed:\n${result.output}`);
 * }
 */
export function block(
  reason: string,
  options?: { systemMessage?: string },
): HookOutput {
  return {
    decision: "block",
    reason,
    systemMessage: options?.systemMessage,
  };
}

/**
 * Output informational context to the conversation.
 *
 * Use for: success messages, status updates, timing info.
 * The message is shown to Claude but doesn't block execution.
 *
 * @example
 * return context(`Build completed in ${duration}ms`);
 */
export function context(message: string): undefined {
  console.log(message);
  return undefined;
}

/**
 * Deny/block the operation (alias for block).
 *
 * Use for: PreToolUse hooks to prevent tool execution.
 * Semantically clearer than block() for permission denials.
 *
 * @example
 * if (isDangerousCommand(cmd)) {
 *   return deny("Command not allowed: " + cmd);
 * }
 */
export function deny(reason: string): HookOutput {
  return {
    decision: "block",
    reason,
  };
}

/**
 * Stop Claude entirely and end the session.
 *
 * Use for: critical failures, unrecoverable errors, security issues.
 * Claude will not continue after this.
 *
 * @example
 * if (secretsExposed) {
 *   return stop("Secrets were exposed - stopping immediately");
 * }
 */
export function stop(reason: string): HookOutput {
  return {
    continue: false,
    stopReason: reason,
  };
}

/**
 * Explicitly approve and optionally suppress output.
 *
 * Use for: auto-approving known-safe operations, silent approvals.
 *
 * @example
 * if (isKnownSafeCommand(cmd)) {
 *   return approve({ suppressOutput: true });
 * }
 */
export function approve(options?: { suppressOutput?: boolean }): HookOutput {
  return {
    decision: "approve",
    suppressOutput: options?.suppressOutput,
  };
}
