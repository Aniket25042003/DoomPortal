import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, "..", "public", "app-icon.png");
const outputPath = inputPath;

// Theme colors from globals.css: --background #0a0a1a, --card #13131f
const THEME_BG = { r: 10, g: 10, b: 26 };
const THEME_BG_HEX = "#0a0a1a";

const { data, info } = await sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const pixelCount = width * height;

// Replace near-white pixels (background) with theme color
for (let i = 0; i < pixelCount; i++) {
  const r = data[i * channels];
  const g = data[i * channels + 1];
  const b = data[i * channels + 2];
  const a = channels === 4 ? data[i * channels + 3] : 255;

  // Treat as background if: high luminance and high alpha
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const isBackground = luminance > 0.92 && a > 200;

  if (isBackground) {
    data[i * channels] = THEME_BG.r;
    data[i * channels + 1] = THEME_BG.g;
    data[i * channels + 2] = THEME_BG.b;
    if (channels === 4) data[i * channels + 3] = 255;
  }
}

await sharp(Buffer.from(data), {
  raw: { width, height, channels },
})
  .png()
  .toFile(outputPath);

console.log("App icon themed successfully:", outputPath);
