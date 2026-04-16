import type { Category } from "../data/products";

export type VisibleCategory = Category | "all";

export const storeCategories = [
  { id: "all", name: "الكل" },
  { id: "social", name: "التواصل الاجتماعي" },
  { id: "ai", name: "الذكاء الاصطناعي" },
  { id: "web", name: "المواقع والمتاجر" },
  { id: "gaming", name: "الألعاب" },
] as const satisfies ReadonlyArray<{ id: VisibleCategory; name: string }>;

export function isVisibleCategory(value: string | null | undefined): value is VisibleCategory {
  return value === "all" || storeCategories.some((category) => category.id === value);
}

export function getCategoryName(categoryId: string) {
  return storeCategories.find((category) => category.id === categoryId)?.name ?? categoryId;
}

export function getCatalogPath(category: VisibleCategory) {
  return category === "all" ? "/products" : `/products/catalog/${category}`;
}

export function getCatalogRouteCategory(categoryParam: string | null | undefined): VisibleCategory | null {
  if (!categoryParam) return "all";
  if (!isVisibleCategory(categoryParam)) return null;
  return categoryParam;
}
