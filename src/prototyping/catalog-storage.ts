import type { Category, Dish } from "./mock-data";

export const CATEGORIES_STORAGE_KEY = "sabor-de-casa:categories";
export const DISHES_STORAGE_KEY = "sabor-de-casa:dishes";

export function readCatalog<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function writeCatalog(key: string, value: Category[] | Dish[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
