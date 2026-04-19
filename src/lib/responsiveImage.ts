import type { SyntheticEvent } from "react";
import { responsiveImageWidths } from "../generated/responsiveImages";

const PRODUCT_IMAGE_PATTERN = /^\/assets\/.+\.(?:avif|webp)$/i;

function withResponsiveSuffix(src: string, width: number) {
  return src.replace(/\.(?:avif|webp)$/i, `-${width}.avif`);
}

function normalizeResponsiveProductImageSrc(src: string) {
  if (/\.webp$/i.test(src)) {
    const avifSrc = src.replace(/\.webp$/i, ".avif");
    if (responsiveImageWidths[avifSrc]) {
      return avifSrc;
    }
  }

  return src;
}

export function getResponsiveProductImage(src?: string | null) {
  const resolvedSrc = normalizeResponsiveProductImageSrc(src || "/assets/store-fallback.svg");

  if (!PRODUCT_IMAGE_PATTERN.test(resolvedSrc)) {
    return { src: resolvedSrc };
  }

  const widths = responsiveImageWidths[resolvedSrc];
  if (!widths?.length) {
    return { src: resolvedSrc };
  }

  const maxWidth = widths[widths.length - 1];

  return {
    src: resolvedSrc,
    srcSet: widths
      .map((width) => `${width === maxWidth ? resolvedSrc : withResponsiveSuffix(resolvedSrc, width)} ${width}w`)
      .join(", "),
  };
}

export function handleResponsiveImageError(
  event: SyntheticEvent<HTMLImageElement>,
  fallbackSrc?: string | null,
) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === "true") return;

  image.dataset.fallbackApplied = "true";
  image.src = normalizeResponsiveProductImageSrc(fallbackSrc || image.src);
  image.srcset = "";
}
