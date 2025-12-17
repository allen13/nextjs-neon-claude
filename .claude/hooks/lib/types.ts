// Hook event types
export type HookEvent =
  | "PreToolUse"
  | "PostToolUse"
  | "UserPromptSubmit"
  | "SessionStart"
  | "SessionEnd"
  | "Stop"
  | "SubagentStop"
  | "Notification"
  | "PreCompact"
  | "PermissionRequest";

// Base input shared by all hooks
export interface HookInputBase {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode: "default" | "plan" | "acceptEdits" | "bypassPermissions";
  hook_event_name: HookEvent;
}

// PreToolUse input
export interface PreToolUseInput extends HookInputBase {
  hook_event_name: "PreToolUse";
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_use_id: string;
}

// PostToolUse input
export interface PostToolUseInput extends HookInputBase {
  hook_event_name: "PostToolUse";
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_response: unknown;
  tool_use_id: string;
}

// SessionStart input
export interface SessionStartInput extends HookInputBase {
  hook_event_name: "SessionStart";
  source: "startup" | "resume" | "clear" | "compact";
}

// SessionEnd input
export interface SessionEndInput extends HookInputBase {
  hook_event_name: "SessionEnd";
  reason: "clear" | "logout" | "prompt_input_exit" | "other";
}

// UserPromptSubmit input
export interface UserPromptSubmitInput extends HookInputBase {
  hook_event_name: "UserPromptSubmit";
  prompt: string;
}

// Stop input
export interface StopInput extends HookInputBase {
  hook_event_name: "Stop";
  stop_hook_active: boolean;
}

// SubagentStop input
export interface SubagentStopInput extends HookInputBase {
  hook_event_name: "SubagentStop";
  stop_hook_active: boolean;
}

// Notification input
export interface NotificationInput extends HookInputBase {
  hook_event_name: "Notification";
  message: string;
  notification_type: string;
}

// PreCompact input
export interface PreCompactInput extends HookInputBase {
  hook_event_name: "PreCompact";
  trigger: "manual" | "auto";
  custom_instructions: string;
}

// PermissionRequest input
export interface PermissionRequestInput extends HookInputBase {
  hook_event_name: "PermissionRequest";
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_use_id: string;
}

// Union of all hook inputs
export type HookInput =
  | PreToolUseInput
  | PostToolUseInput
  | SessionStartInput
  | SessionEndInput
  | UserPromptSubmitInput
  | StopInput
  | SubagentStopInput
  | NotificationInput
  | PreCompactInput
  | PermissionRequestInput;

// Map event name to input type
export type HookInputFor<E extends HookEvent> = E extends "PreToolUse"
  ? PreToolUseInput
  : E extends "PostToolUse"
    ? PostToolUseInput
    : E extends "SessionStart"
      ? SessionStartInput
      : E extends "SessionEnd"
        ? SessionEndInput
        : E extends "UserPromptSubmit"
          ? UserPromptSubmitInput
          : E extends "Stop"
            ? StopInput
            : E extends "SubagentStop"
              ? SubagentStopInput
              : E extends "Notification"
                ? NotificationInput
                : E extends "PreCompact"
                  ? PreCompactInput
                  : E extends "PermissionRequest"
                    ? PermissionRequestInput
                    : never;

// Hook output types
export interface HookOutput {
  decision?: "block" | "approve";
  reason?: string;
  continue?: boolean;
  stopReason?: string;
  suppressOutput?: boolean;
  systemMessage?: string;
}

// Tool input helpers for common tools
export interface WriteToolInput {
  file_path: string;
  content: string;
}

export interface EditToolInput {
  file_path: string;
  old_string: string;
  new_string: string;
}

export interface BashToolInput {
  command: string;
  timeout?: number;
}

export interface ReadToolInput {
  file_path: string;
  offset?: number;
  limit?: number;
}
