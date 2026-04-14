export const LEGACY_DISCOUNT_PERCENT = 20;

export function formatSudanesePrice(price: number) {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 0,
    maximumFractionDigits: Number.isInteger(price) ? 0 : 2,
  });
}

export function getLegacyOriginalPrice(price: number) {
  const originalPrice = price / (1 - LEGACY_DISCOUNT_PERCENT / 100);
  return Number.isInteger(price) ? Math.round(originalPrice) : Number(originalPrice.toFixed(2));
}

export function getDiscountPercent() {
  return LEGACY_DISCOUNT_PERCENT;
}
