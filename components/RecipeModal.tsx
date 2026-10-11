"use client";
 
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
 
type Recipe = { id: string; title: string; imageUrl: string | null; category: string | null };
 
type Props = { ingredients: string[] };
 
export default function RecipeModal({ ingredients }: Props) {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
 
  const key = ingredients.join("|"); // re-run only when the list actually changes
 
  // Load recipes whenever the ingredient list changes, then pop the window open
  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes(null);
      setOpen(false);
      return;
    }
 
    let cancelled = false;
    setError("");
 
    fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
        if (!Array.isArray(data.recipes)) throw new Error("The recipe service returned an unexpected response.");
        if (!cancelled) {
          setRecipes(data.recipes);
          setOpen(true);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Request failed");
        setOpen(true);
      });
 
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
 
  // While open: Escape closes, the page behind can't scroll, and focus moves to the close button
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);
 
  // Closed: offer a small button to bring the results back
  if (!open) {
    if (!recipes || recipes.length === 0) return null;
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
      >
        Show {recipes.length} recipes
      </button>
    );
  }
 
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)} // click the grey area to close
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        className="relative flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 id="recipe-modal-title" className="text-lg font-semibold">
            Recipes you can make
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-full text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-800"
          >
            ✕
          </button>
        </div>
 
        <div className="overflow-y-auto px-5 pb-5">
          {error ? (
            <p role="alert" className="py-4 text-red-700">
              {error}
            </p>
          ) : recipes && recipes.length === 0 ? (
            <p className="py-4 text-gray-600">No matching recipes found.</p>
          ) : (
            <ul className="space-y-3">
              {recipes?.map((r) => (
                <li key={r.id}>
                  <Link href={`/recipe/${r.id}`} className="block">
                    <RecipeCard name={r.title} image={r.imageUrl ?? ""} category={r.category ?? ""} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}