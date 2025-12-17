import { block, context, formatResults, hook, runAllChecks } from "./lib";

hook("Stop", async (input) => {
  // Skip if stop hook is already active (prevent recursion)
  if (input.stop_hook_active) {
    return;
  }

  const results = await runAllChecks();
  const allPassed = results.every((r) => r.passed);

  if (!allPassed) {
    return block(`SDLC validation failed:\n\n${formatResults(results)}`);
  }

  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  return context(
    `SDLC checks passed (${totalDuration}ms): lint, typecheck, build, tests`,
  );
});
