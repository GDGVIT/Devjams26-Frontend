import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoots = [path.join(appRoot, "app"), path.join(appRoot, "components")];

function sourceFiles(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...sourceFiles(entryPath));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(entryPath);
  }
  return files;
}

test("motion is removed from runtime dependencies", () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(appRoot, "package.json"), "utf8"),
  );
  assert.equal(packageJson.dependencies?.motion, undefined);
  assert.ok(packageJson.dependencies?.gsap);
});

test("source components use GSAP instead of Motion imports", () => {
  const motionImports = sourceRoots.flatMap(sourceFiles).filter((file) =>
    /from ["']motion\//.test(fs.readFileSync(file, "utf8")),
  );
  assert.deepEqual(motionImports, []);
});
