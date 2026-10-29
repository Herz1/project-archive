import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { materialize } from "../.agents/skills/rhine-eidolon-preserve/scripts/materialize-reference.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [name, action] = process.argv.slice(2);
if (!["rhine", "eidolon"].includes(name) || !["setup", "dev", "build"].includes(action)) throw new Error("Usage: reference.mjs rhine|eidolon setup|dev|build");
const target = join(repo, "work", name);
try {
  const saved = JSON.parse(await readFile(join(target, "reference-kit.json"), "utf8"));
  if (saved.reference !== name) throw new Error("Unexpected work copy.");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  await materialize(name, target);
}
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: "1", PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1", npm_config_cache: join(repo, "work/npm-cache") };
const args = action === "setup" ? ["ci", "--no-audit", "--no-fund"]
  : action === "build" ? ["run", "build"]
  : ["run", "dev", "--", ...(name === "rhine" ? ["--port", "5173", "--strictPort"] : ["--hostname", "127.0.0.1", "--port", "3000"])];
if (action !== "setup") {
  try { await access(join(target, "node_modules")); }
  catch { throw new Error("Run npm run setup:" + name + " first."); }
}
const windows = process.platform === "win32";
const executable = windows ? (process.env.ComSpec || "cmd.exe") : "npm";
const commandArgs = windows ? ["/d", "/s", "/c", "npm.cmd " + args.join(" ")] : args;
const child = spawn(executable, commandArgs, { cwd: target, env, stdio: "inherit" });
child.on("error", error => { console.error(error.message); process.exitCode = 1; });
child.on("exit", code => { process.exitCode = code ?? 1; });
