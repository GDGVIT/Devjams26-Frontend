#!/usr/bin/env node
/**
 * Bakes the gradient-blob artwork in assets-src/ into flat PNGs under
 * public/assets/baked/.
 *
 * Those sources are Figma exports: an alpha mask over ~19 base64-embedded PNGs
 * pushed through an feGaussianBlur. Nothing inside them animates, so shipping
 * them as SVG made the browser re-run that whole filter graph on every repaint
 * — and re-rasterize it whenever the scroll transition changed an element's
 * scale. Baked, each one is a single texture the compositor just moves.
 *
 * Rendering goes through headless Chrome rather than a standalone SVG
 * rasterizer so the output is byte-for-byte what the site paints today
 * (mix-blend-mode, pattern transforms and filter regions all included).
 *
 * Sizes below are 2x the largest box each asset is ever displayed in, so they
 * stay crisp at 2x DPR. frameScaleAtViewport() caps at 1, so those boxes never
 * grow past the 1440px reference layout.
 *
 *   npm run bake
 */

import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "assets-src");
const outDir = path.join(root, "public", "assets", "baked");

/** width/height are the baked pixel dimensions (2x max display size). */
const TARGETS = [
  { src: "android.svg", out: "android.png", width: 936, height: 572 },
  { src: "web.svg", out: "web.png", width: 908, height: 908 },
  { src: "cloud.svg", out: "cloud.png", width: 936, height: 684 },
  { src: "maps.svg", out: "maps.png", width: 730, height: 930 },
  { src: "dino-menu.svg", out: "dino-menu.png", width: 130, height: 138 },
  { src: "cursor.svg", out: "cursor.png", width: 410, height: 530 },
  { src: "notebookllm.svg", out: "notebookllm.png", width: 342, height: 360 },
  { src: "logo/triangle.svg", out: "logo/triangle.png", width: 600, height: 600 },
  { src: "logo/circle.svg", out: "logo/circle.png", width: 480, height: 480 },
  { src: "leftbracket.svg", out: "leftbracket.png", width: 256, height: 664 },
  { src: "rightbracket.svg", out: "rightbracket.png", width: 256, height: 664 },
  { src: "umbrella.svg", out: "umbrella.png", width: 512, height: 368 },
  // Stretched edge to edge with preserveAspectRatio="none", and it is a soft
  // blur, so it needs no more resolution than its own coordinate space.
  { src: "faq-mesh.svg", out: "faq-mesh.png", width: 1000, height: 650 },
  // Sponsor card dino: 69x73 viewBox, shown at ~68px wide.
  { src: "spons-dino.svg", out: "spons-dino.png", width: 138, height: 146 },
  // Sponsors decoration: 92x63 viewBox, scattered at ~66px wide.
  { src: "ded.svg", out: "ded.png", width: 184, height: 126 },
];

const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe` : undefined,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

async function resolveChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await stat(candidate);
      return candidate;
    } catch {
      // try the next one
    }
  }
  throw new Error(
    `No Chrome binary found. Tried:\n  ${CHROME_CANDIDATES.join("\n  ")}\nSet CHROME_BIN to override.`,
  );
}

function formatBytes(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`;
}

async function bake(chrome, workDir, target) {
  const srcPath = path.join(srcDir, target.src);
  const outPath = path.join(outDir, target.out);
  await mkdir(path.dirname(outPath), { recursive: true });

  // Chrome screenshots the viewport, so the wrapper pins the artwork to exactly
  // the requested box with no margin and a transparent backdrop.
  const wrapper = path.join(workDir, `${target.out.replace(/[\\/]/g, "_")}.html`);
  await writeFile(
    wrapper,
    `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;background:transparent;overflow:hidden}
  img{display:block;width:${target.width}px;height:${target.height}px}
</style>
<img src="${pathToFileURL(srcPath).href}">`,
    "utf-8",
  );

  await execFileAsync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--default-background-color=00000000",
      "--force-device-scale-factor=1",
      `--window-size=${target.width},${target.height}`,
      `--screenshot=${outPath}`,
      pathToFileURL(wrapper).href,
    ],
    { maxBuffer: 64 * 1024 * 1024 },
  );

  const [before, after] = await Promise.all([stat(srcPath), stat(outPath)]);
  return { before: before.size, after: after.size };
}

async function main() {
  const chrome = await resolveChrome();
  await mkdir(outDir, { recursive: true });
  const workDir = await mkdtemp(path.join(tmpdir(), "bake-assets-"));

  let totalBefore = 0;
  let totalAfter = 0;
  try {
    for (const target of TARGETS) {
      const { before, after } = await bake(chrome, workDir, target);
      totalBefore += before;
      totalAfter += after;
      console.log(
        `  ${target.src.padEnd(20)} ${formatBytes(before).padStart(9)} -> ${formatBytes(after).padStart(9)}` +
          `  (${target.width}x${target.height})`,
      );
    }
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }

  console.log(
    `\n  ${"total".padEnd(20)} ${formatBytes(totalBefore).padStart(9)} -> ${formatBytes(totalAfter).padStart(9)}` +
      `  (${(totalBefore / totalAfter).toFixed(0)}x smaller)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
