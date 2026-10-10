import { pool } from "@/lib/db";
 
export type RecipeDetail = {
  id: string;
  name: string;
  category: string | null;
  area: string | null;
  thumbnailUrl: string | null;
  sourceUrl: string | null;
  ingredients: { name: string; measure: string }[];
  steps: string[];
};
 
// Fetches one full recipe by its meal_id. Returns null if it doesn't exist.
export async function getRecipe(id: string): Promise<RecipeDetail | null> {
  const { rows } = await pool.query(
    `SELECT meal_id, name, category, area, instructions, thumbnail_url, source_url, ingredients
     FROM recipes WHERE meal_id = $1`,
    [id]
  );
  const r = rows[0];
  if (!r) return null;
 
  const ingredients = (Array.isArray(r.ingredients) ? r.ingredients : [])
    .map((i: { name?: string; measure?: string }) => ({
      name: (i.name ?? "").trim(),
      measure: (i.measure ?? "").trim(),
    }))
    .filter((i: { name: string }) => i.name);
 
  // Instructions are one block of text; split into lines and drop "STEP 1"-style labels
  const steps = String(r.instructions ?? "")
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter((s) => s && !/^step\s*\d+$/i.test(s));
 
  return {
    id: r.meal_id,
    name: r.name,
    category: r.category,
    area: r.area,
    thumbnailUrl: r.thumbnail_url,
    sourceUrl: r.source_url,
    ingredients,
    steps,
  };
}
 