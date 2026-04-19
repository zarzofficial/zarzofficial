import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assetDir = path.resolve("public/assets");
const generatedManifestPath = path.resolve("src/generated/responsiveImages.ts");
const widths = [160, 320, 480, 560, 640, 960, 1280];
const responsiveExtension = ".avif";
const supportedSourceExtensions = new Set([".avif", ".webp"]);
const variantPattern = new RegExp(`-\\d+\\${responsiveExtension}$`, "i");
const legacyVariantPattern = /-\d+\.webp$/i;

function getAvifOptions(width) {
  return {
    quality: width <= 320 ? 58 : width <= 640 ? 62 : 66,
    effort: 7,
    chromaSubsampling: "4:4:4",
  };
}

function getVariantFileName(baseName, width) {
  return `${baseName}-${width}${responsiveExtension}`;
}

function getResponsiveFileName(baseName) {
  return `${baseName}${responsiveExtension}`;
}

async function generateResponsiveVariants() {
  const entries = await readdir(assetDir, { withFileTypes: true });
  const productSources = new Map();
  const legacyFilesToDelete = new Set();

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (!supportedSourceExtensions.has(extension)) continue;
    if (variantPattern.test(entry.name) || legacyVariantPattern.test(entry.name)) continue;

    const baseName = path.basename(entry.name, extension);
    const existingEntry = productSources.get(baseName) || {};
    existingEntry[extension] = entry.name;
    productSources.set(baseName, existingEntry);
  }

  let generatedCount = 0;
  const responsiveImageWidths = {};

  for (const [baseName, variants] of [...productSources.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    const avifFileName = getResponsiveFileName(baseName);
    const avifPath = path.join(assetDir, avifFileName);
    const legacyWebpFileName = variants[".webp"];
    const legacyWebpPath = legacyWebpFileName ? path.join(assetDir, legacyWebpFileName) : null;

    let avifStats = null;
    try {
      avifStats = await stat(avifPath);
    } catch {
      // Missing AVIF source; generate it below from the legacy WebP when available.
    }

    if (legacyWebpPath) {
      const webpStats = await stat(legacyWebpPath);
      const shouldRefreshAvif = !avifStats || webpStats.mtimeMs > avifStats.mtimeMs;

      if (shouldRefreshAvif) {
        await sharp(legacyWebpPath, { animated: false })
          .avif(getAvifOptions(Number.MAX_SAFE_INTEGER))
          .toFile(avifPath);
        generatedCount += 1;
        avifStats = await stat(avifPath);
      }
    }

    if (!avifStats) continue;

    const image = sharp(avifPath, { animated: false });
    const metadata = await image.metadata();

    if (!metadata.width) continue;

    responsiveImageWidths[`/assets/${avifFileName}`] = [
      ...widths.filter((width) => width < metadata.width),
      metadata.width,
    ];

    for (const width of widths) {
      if (width >= metadata.width) continue;

      const outputPath = path.join(assetDir, getVariantFileName(baseName, width));

      try {
        const outputStats = await stat(outputPath);
        if (outputStats.mtimeMs >= avifStats.mtimeMs) {
          continue;
        }
      } catch {
        // Missing or stale output; regenerate below.
      }

      await image
        .clone()
        .resize({ width, withoutEnlargement: true, fit: "inside" })
        .avif(getAvifOptions(width))
        .toFile(outputPath);

      generatedCount += 1;
    }

    const legacyFiles = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => fileName === `${baseName}.webp` || new RegExp(`^${baseName}-\\d+\\.webp$`, "i").test(fileName));

    for (const legacyFile of legacyFiles) {
      legacyFilesToDelete.add(path.join(assetDir, legacyFile));
    }
  }

  for (const legacyFilePath of legacyFilesToDelete) {
    try {
      await rm(legacyFilePath, { force: true });
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "EBUSY") {
        continue;
      }

      throw error;
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
