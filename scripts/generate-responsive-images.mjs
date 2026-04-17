import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assetDir = path.resolve("public/assets");
const widths = [160, 320, 480, 640, 960, 1280];
const variantPattern = /-\d+\.webp$/i;

async function generateResponsiveVariants() {
  const entries = await readdir(assetDir, { withFileTypes: true });
  const sourceFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".webp") && !variantPattern.test(entry.name))
    .map((entry) => entry.name);

  let generatedCount = 0;

  for (const fileName of sourceFiles) {
    const inputPath = path.join(assetDir, fileName);
    const sourceStats = await stat(inputPath);
    const image = sharp(inputPath, { animated: false });
    const metadata = await image.metadata();

    if (!metadata.width) continue;

    for (const width of widths) {
      if (width >= metadata.width) continue;

      const outputPath = path.join(assetDir, fileName.replace(/\.webp$/i, `-${width}.webp`));

      try {
        const outputStats = await stat(outputPath);
        if (outputStats.mtimeMs >= sourceStats.mtimeMs) {
          continue;
        }
      } catch {
        // Missing or stale output; regenerate below.
      }

      await image
        .clone()
        .resize({ width, withoutEnlargement: true, fit: "inside" })
        .webp({
          quality: width <= 320 ? 72 : width <= 640 ? 76 : 80,
          effort: 6,
        })
        .toFile(outputPath);

      generatedCount += 1;
    }
  }

  console.log(`Generated ${generatedCount} responsive image variants.`);
}

await generateResponsiveVariants();
