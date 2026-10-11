import { pool } from "@/lib/db";
import { normalize, STAPLES } from "@/lib/normalize";
 
type Ingredient = { name?: string; measure?: string };
 
const DEFAULT_MAX_MISSING = 3; // hide recipes that need more than this many extra ingredients
 
const tokens = (s: string) => new Set(s.split(" ").filter(Boolean));
const containsAll = (big: Set<string>, small: Set<string>) => [...small].every((t) => big.has(t));
 
export async function POST(req: Request) {
  const { ingredients, maxMissing: requested } = await req.json();
  // The client may ask for a different limit; otherwise use the default
  const maxMissing = Number.isFinite(requested)
    ? Math.max(0, Math.min(20, Math.floor(requested)))
    : DEFAULT_MAX_MISSING;
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return Response.json({ error: "No ingredients were sent" }, { status: 400 });
  }
 
  // What the user has, as word sets: "Chicken Breasts" -> {chicken, breast}
  const have = (ingredients as unknown[])
    .map((x) => normalize(String(x)))
    .filter(Boolean)
    .map(tokens);
 
  try {
    // The table is a few hundred rows, so we fetch the light columns and match in code.
    const { rows } = await pool.query(
      "SELECT meal_id, name, category, thumbnail_url, ingredients FROM recipes"
    );
 
    const results = [];
    for (const row of rows) {
      const list: Ingredient[] = Array.isArray(row.ingredients) ? row.ingredients : [];
      const haveList: string[] = [];
      const missingList: string[] = [];
 
      for (const ing of list) {
        const name = ing.name ?? "";
        const n = normalize(name);
        if (!n || STAPLES.has(n)) continue;
 
        // Match if one phrase's words are all inside the other's:
        // "chicken" matches "chicken breast", "cheddar cheese" matches "cheese"
        const t = tokens(n);
        const matched = have.some((u) => containsAll(t, u) || containsAll(u, t));
        (matched ? haveList : missingList).push(name);
      }
 
      if (haveList.length > 0 && missingList.length <= maxMissing) {
        results.push({
          id: row.meal_id,
          title: row.name,
          category: row.category,
          imageUrl: row.thumbnail_url,
          have: haveList,
          missing: missingList,
        });
      }
    }
 
    // Fewest missing ingredients first, then most matched
    results.sort((a, b) => a.missing.length - b.missing.length || b.have.length - a.have.length);
 
    return Response.json({ recipes: results.slice(0, 20) });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Recipe lookup failed. Check DATABASE_URL and that the recipes table exists." },
      { status: 500 }
    );
  }
}
 