"use client";
 
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
 
type Recipe = { id: string; title: string; imageUrl: string | null; category: string | null; missing: string[] };
 
type Props = { ingredients: string[] };
 
export default function RecipeModal({ ingredients }: Props) {
  const [list, setList] = useState<string[]>([]); // the editable copy shown in the header
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
 
  const propKey = ingredients.join("|");
  const listKey = list.join("|");
 
  function close() {
    setOpen(false);
    setAdding(false);
    setDraft("");
  }
 
  function addIngredient(raw: string) {
    const names = raw.split(",").map((s) => s.trim()).filter(Boolean); // "garlic, onion" adds both
    setList((prev) => {
      const seen = new Set(prev.map((p) => p.toLowerCase()));
      const next = [...prev];
      for (const n of names) {
        if (!seen.has(n.toLowerCase())) {
          seen.add(n.toLowerCase());
          next.push(n);
        }
      }
      return next;
    });
    setDraft("");
    setAdding(false);
  }
 
  function removeIngredient(index: number) {
    setList((prev) => prev.filter((_, i) => i !== index));
  }
 
  // New ingredients arrive from the parent: replace our editable copy
  useEffect(() => {
    setList(ingredients);
    if (ingredients.length === 0) close(); // parent cleared everything, so hide the popup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propKey]);
 
  // Whenever the list changes (scan, remove, add), look up recipes again
  useEffect(() => {
    if (list.length === 0) {
      setRecipes([]);
      setError("");
      setLoading(false);
      return;
    }
 
    let cancelled = false;
    setLoading(true);
    setError("");
 
    fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: list }),
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
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
 
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey]);
 
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
      onClick={(e) => e.target === e.currentTarget && close()} // click the grey area to close
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        className="relative flex max-h-[80vh] w-full max-w-md flex-col rounded-[2rem] bg-[#f7f3ea] shadow-2xl ring-1 ring-white/70"
      >
        {/* Header: title and close button stay fixed at the top */}
        <div className="px-5 pb-2 pt-4">
          <div className="flex items-center justify-between">
            <h2 id="recipe-modal-title" className="text-lg font-semibold">
              Recipes you can make
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid size-8 place-items-center rounded-full text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-800"
            >
              ✕
            </button>
          </div>
        </div>
 
        {/* Scrollable area: ingredient chips first, then the recipe list */}
        <div className="overflow-y-auto px-5 pb-5 pt-1">
          <ul aria-label="Your ingredients" className="flex flex-wrap gap-2">
            {list.map((name, i) => (
              <li
                key={`${name}-${i}`}
                className="flex items-center gap-1 rounded-lg bg-gray-100 py-1 pl-3 pr-1.5 text-sm"
              >
                {name}
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  aria-label={`Remove ${name}`}
                  className="grid size-5 place-items-center rounded text-xs text-gray-500 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-800"
                >
                  ✕
                </button>
              </li>
            ))}
 
            <li>
              {adding ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addIngredient(draft);
                  }}
                >
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => (draft.trim() ? addIngredient(draft) : setAdding(false))}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.stopPropagation(); // cancel adding without closing the whole popup
                        setDraft("");
                        setAdding(false);
                      }
                    }}
                    placeholder="e.g. garlic"
                    aria-label="New ingredient"
                    className="h-8 w-32 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-800"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  aria-label="Add ingredient"
                  className="grid size-8 place-items-center rounded-lg border border-gray-300 text-lg leading-none text-gray-600 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-800"
                >
                  +
                </button>
              )}
            </li>
          </ul>
 
          <div className="mt-3">
          {error ? (
            <p role="alert" className="py-4 text-red-700">
              {error}
            </p>
          ) : list.length === 0 ? (
            <p className="py-4 text-gray-600">Add an ingredient to see recipes.</p>
          ) : !recipes ? (
            <p className="py-4 text-gray-600">Finding recipes…</p>
          ) : recipes.length === 0 && !loading ? (
            <p className="py-4 text-gray-600">No matching recipes found.</p>
          ) : (
            <ul className={`space-y-3 transition-opacity ${loading ? "opacity-50" : ""}`} aria-busy={loading}>
              {recipes.map((r) => (
                <li key={r.id}>
                  <Link href={`/recipe/${r.id}`} className="block">
                    <RecipeCard
                      name={r.title}
                      image={r.imageUrl ?? ""}
                      category={r.category ?? ""}
                      missingCount={r.missing.length}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}