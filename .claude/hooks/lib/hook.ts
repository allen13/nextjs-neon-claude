import type { HookEvent, HookInput, HookInputFor, HookOutput } from "./types";

type HookHandler<E extends HookEvent> = (
  input: HookInputFor<E>,
) => Promise<HookOutput | undefined> | HookOutput | undefined;

/**
 * Create and run a hook handler.
 *
 * @param event - The hook event type (for type inference)
 * @param handler - Async function that receives hook input and returns output
 */
export function hook<E extends HookEvent>(
  event: E,
  handler: HookHandler<E>,
): void {
  runHook(event, handler);
}

async function runHook<E extends HookEvent>(
  event: E,
  handler: HookHandler<E>,
): Promise<void> {
  try {
    const input = await Bun.readableStreamToText(Bun.stdin.stream());
    const parsed = JSON.parse(input) as HookInput;
    const result = await handler(parsed as HookInputFor<E>);

    if (result !== undefined && result !== null) {
      console.log(JSON.stringify(result));
    }

    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${event}] ${message}`);
    process.exit(2);
  }
}
