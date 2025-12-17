import { hook } from "./lib";
import { notify } from "./lib/notify";

hook("Notification", async (input) => {
  const title =
    input.notification_type === "error"
      ? "Claude Code - Error"
      : input.notification_type === "warning"
        ? "Claude Code - Warning"
        : "Claude Code";

  await notify(input.message, title);
  return undefined;
});
