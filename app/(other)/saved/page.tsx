"use client";
 
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import { useSavedRecipes } from "@/lib/savedRecipes";
 
export default function SavedPage() {
  const { saved, ready } = useSavedRecipes();
 
  return (
    <main className="min-h-screen bg-[#f7f3ea] pb-32 pt-28 text-[#193c2d]">
      <div className="mx-auto w-full max-w-md px-4">
        <section className="rounded-[2rem] bg-[#193c2d] p-6 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f5d98b]">
            Your cookbook
          </p>
 
          <h1 className="mt-2 text-3xl font-bold">Saved recipes</h1>
 
          <p className="mt-3 text-sm leading-6 text-white/80">
            {ready && saved.length > 0
              ? `${saved.length} recipe${saved.length === 1 ? "" : "s"} saved on this device.`
              : "Keep the meals you want to make again all in one place."}
          </p>
        </section>
 
        {!ready ? (
          <p className="mt-6 animate-pulse text-center text-sm font-medium text-[#6b7d70]">
            Loading your recipes…
          </p>
        ) : saved.length === 0 ? (
          <section className="mt-6 rounded-[2rem] bg-white px-6 py-12 text-center shadow-sm ring-1 ring-[#e6dfd0]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e5efe6] text-4xl">
              ♡
            </div>
 
            <h2 className="mt-6 text-2xl font-bold">Nothing saved yet</h2>
 
            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#6b7d70]">
              When you find a recipe you love, tap the heart to save it here so
              it is ready when you need dinner inspiration.
            </p>
 
            <Link
              href="/new_meal"
              className="mt-7 inline-flex items-center justify-center rounded-2xl bg-[#193c2d] px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-[#285540]"
            >
              Find a recipe
            </Link>
          </section>
        ) : (
          <ul className="mt-6 space-y-4">
            {saved.map((r) => (
              <li key={r.id}>
                <RecipeCard id={r.id} name={r.name} image={r.image} category={r.category} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}