import { block, hook, runCommand } from "./lib";

hook("SessionStart", async (input) => {
  if (input.source !== "startup") {
    return;
  }

  const result = await runCommand(["bun", "install"]);
  if (result.exitCode !== 0) {
    return block(`Dependency installation failed:\n${result.stderr}`);
  }
});
