const PRODUCT_IMAGE_WIDTHS = [160, 320, 480, 640, 960, 1280] as const;
const PRODUCT_IMAGE_PATTERN = /^\/assets\/.+\.webp$/i;

function withResponsiveSuffix(src: string, width: number) {
  return src.replace(/\.webp$/i, `-${width}.webp`);
}

export function getResponsiveProductImage(src?: string | null) {
  const resolvedSrc = src || "/assets/store-fallback.svg";

  if (!PRODUCT_IMAGE_PATTERN.test(resolvedSrc)) {
    return { src: resolvedSrc };
  }

  return {
    src: resolvedSrc,
    srcSet: PRODUCT_IMAGE_WIDTHS.map((width) => `${withResponsiveSuffix(resolvedSrc, width)} ${width}w`).join(", "),
  };
}
