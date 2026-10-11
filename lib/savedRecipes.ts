import { useMemo, useSyncExternalStore } from "react";
 
export type SavedRecipe = {
  id: string;
  name: string;
  image: string;
  category: string;
  savedAt: number;
};
 
const KEY = "fridgesnap:saved-recipes";
const listeners = new Set<() => void>();
 
function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]"; // storage blocked (e.g. some private modes)
  }
}
 
function parse(raw: string): SavedRecipe[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
 
function write(list: SavedRecipe[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage full or blocked: nothing we can do
  }
  listeners.forEach((notify) => notify()); // tell every button and page on this tab to re-read
}
 
function subscribe(notify: () => void) {
  listeners.add(notify);
  // Also react when another browser tab changes the saved list
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}
 
// Save the recipe if it isn't saved yet, remove it if it is
export function toggleSaved(recipe: Omit<SavedRecipe, "savedAt">) {
  const list = parse(readRaw());
  const exists = list.some((r) => r.id === recipe.id);
  write(exists ? list.filter((r) => r.id !== recipe.id) : [{ ...recipe, savedAt: Date.now() }, ...list]);
}
 
export function useSavedRecipes() {
  // On the server there is no localStorage, so the snapshot is null until the browser takes over
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const saved = useMemo(() => (raw === null ? [] : parse(raw)), [raw]);
 
  return {
    saved,
    ready: raw !== null, // false during server render and first paint, so pages can avoid an "empty" flash
    isSaved: (id: string) => saved.some((r) => r.id === id),
  };
}