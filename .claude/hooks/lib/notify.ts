import { runCommand } from "./utils";

/**
 * Send a macOS desktop notification using osascript.
 *
 * @param message - The notification body text
 * @param title - Optional title (defaults to "Claude Code")
 * @param sound - Whether to play the default notification sound
 */
export async function notify(
  message: string,
  title = "Claude Code",
  sound = true,
): Promise<void> {
  // Only run on macOS
  if (process.platform !== "darwin") {
    return;
  }

  // Escape quotes for AppleScript
  const escapedMessage = message.replace(/"/g, '\\"');
  const escapedTitle = title.replace(/"/g, '\\"');

  const soundClause = sound ? ' sound name "default"' : "";
  const script = `display notification "${escapedMessage}" with title "${escapedTitle}"${soundClause}`;

  await runCommand(["osascript", "-e", script]);
}
