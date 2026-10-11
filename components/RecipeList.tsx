
"use client";
 
import Link from "next/link";
import { useEffect, useState } from "react";
 
type Recipe = { id: string; title: string; imageUrl: string | null; have: string[]; missing: string[] };
 
type Props = { ingredients: string[] };
 
export default function RecipeList({ ingredients }: Props) {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const key = ingredients.join("|"); // re-run only when the list actually changes
 
  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes(null);
      return;
    }
 
    let cancelled = false;
    setLoading(true);
    setError("");
 
    fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
        if (!Array.isArray(data.recipes)) {
          console.error("Unexpected /api/recipes response:", data);
          throw new Error("The recipe service returned an unexpected response.");
        }
        if (!cancelled) setRecipes(data.recipes);
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Request failed"))
      .finally(() => !cancelled && setLoading(false));
 
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
 
  if (ingredients.length === 0) return null;
  if (loading) return <p>Finding recipes…</p>;
  if (error) return <p role="alert">{error}</p>;
  if (recipes === null) return null;
  if (recipes.length === 0) return <p>No matching recipes found.</p>;
 
  return (
    <div>
      <h2>Recipes you can make</h2>
      <p>
        <Link href={`/recipe/${recipes[0].id}`}>Open the top match: {recipes[0].title} →</Link>
      </p>
      <ol>
        {recipes.map((r) => (
          <li key={r.id} style={{ marginBottom: 8 }}>
            <Link href={`/recipe/${r.id}`}><strong>{r.title}</strong></Link>
            <div>
              {r.missing.length === 0
                ? "You have everything"
                : `Missing ${r.missing.length}: ${r.missing.join(", ")}`}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
 