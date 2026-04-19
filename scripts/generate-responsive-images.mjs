import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assetDir = path.resolve("public/assets");
const generatedManifestPath = path.resolve("src/generated/responsiveImages.ts");
const widths = [160, 320, 480, 560, 640, 960, 1280];
const variantPattern = /-\d+\.webp$/i;

async function generateResponsiveVariants() {
  const entries = await readdir(assetDir, { withFileTypes: true });
  const sourceFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".webp") && !variantPattern.test(entry.name))
    .map((entry) => entry.name);

  let generatedCount = 0;
  const responsiveImageWidths = {};

  for (const fileName of sourceFiles) {
    const inputPath = path.join(assetDir, fileName);
    const sourceStats = await stat(inputPath);
    const image = sharp(inputPath, { animated: false });
    const metadata = await image.metadata();

    if (!metadata.width) continue;

    responsiveImageWidths[`/assets/${fileName}`] = [
      ...widths.filter((width) => width < metadata.width),
      metadata.width,
    ];

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

  const manifestEntries = Object.entries(responsiveImageWidths)
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .map(([imagePath, availableWidths]) => `  ${JSON.stringify(imagePath)}: [${availableWidths.join(", ")}],`)
    .join("\n");

  await mkdir(path.dirname(generatedManifestPath), { recursive: true });
  await writeFile(
    generatedManifestPath,
    `export const responsiveImageWidths: Record<string, readonly number[]> = {\n${manifestEntries}\n};\n`,
    "utf8",
  );

  console.log(`Generated ${generatedCount} responsive image variants.`);
}

await generateResponsiveVariants();
