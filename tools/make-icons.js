// Raster icons. The mark is tools/logo-master.png (transparent logo).
//   node tools/make-icons.js
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const result = spawnSync("python3", [path.join(ROOT, "tools", "make-icons.py")], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
