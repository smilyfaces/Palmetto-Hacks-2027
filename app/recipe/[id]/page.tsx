import { Suspense } from "react";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import AddPhotos from "@/components/AddPhotos";
import ReactionButtons from "@/components/ReactionButtons";
import SaveButton from "@/components/SaveButton";
import { getRecipe } from "@/lib/recipes";
 
export default function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-[#f7f3ea] pb-32 pt-28 text-[#193c2d]">
      <div className="mx-auto w-full max-w-md px-4">
        <BackButton />
 
        <Suspense
          fallback={
            <div className="mt-6 rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-[#e6dfd0]">
              <p className="animate-pulse text-sm font-medium text-[#6b7d70]">
                Loading your recipe…
              </p>
            </div>
          }
        >
          <RecipeContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
 
async function RecipeContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);
 
  if (!recipe) notFound();
 
  const subtitle = [recipe.category, recipe.area].filter(Boolean).join(" · ");
 
  const displaySteps = recipe.steps
  .map((step) => step.trim())
  .filter((step) => !/^\d+[.)]?$/.test(step))
  .map((step) => step.replace(/^\d+[.)]\s*/, ""));
 
  return (
    <article className="mt-5">
      {recipe.thumbnailUrl ? (
        <div className="relative overflow-hidden rounded-[2rem] shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recipe.thumbnailUrl}
            alt={recipe.name}
            className="h-64 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#193c2d]/75 via-transparent to-transparent" />
 
          {subtitle && (
            <p className="absolute bottom-5 left-5 rounded-full bg-[#f5d98b] px-3 py-1 text-xs font-bold text-[#193c2d]">
              {subtitle}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-[2rem] bg-[#193c2d] p-7 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f5d98b]">
            FridgeSnap recipe
          </p>
          {subtitle && <p className="mt-3 text-sm text-white/75">{subtitle}</p>}
        </div>
      )}
 
      <section className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6b7d70]">
          Tonight&apos;s meal
        </p>
        <h1 className="mt-1 text-3xl font-bold leading-tight">{recipe.name}</h1>
 
        <p className="mt-3 text-sm leading-6 text-[#6b7d70]">
          Gather what you need, follow the steps, and enjoy your meal.
        </p>
 
        <div className="mt-4">
          <SaveButton
            variant="full"
            recipe={{
              id: recipe.id,
              name: recipe.name,
              image: recipe.thumbnailUrl ?? "",
              category: recipe.category ?? "",
            }}
          />
        </div>
      </section>
 
      <section className="mt-7 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#e6dfd0]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5efe6] text-xl">
            🥕
          </div>
          <div>
            <p className="text-sm font-semibold text-[#6b7d70]">What you need</p>
            <h2 className="text-xl font-bold">Ingredients</h2>
          </div>
        </div>
 
        <ul className="mt-5 space-y-3">
          {recipe.ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-start gap-3 border-b border-[#eee8dc] pb-3 last:border-0 last:pb-0"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#83a98b]" />
              <p className="text-sm leading-6">
                {ingredient.measure && (
                  <span className="font-bold text-[#193c2d]">
                    {ingredient.measure}{" "}
                  </span>
                )}
                {ingredient.name}
              </p>
            </li>
          ))}
        </ul>
      </section>
 
      <section className="mt-5 rounded-[2rem] bg-[#193c2d] p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5d98b] text-xl">
            🍳
          </div>
          <div>
            <p className="text-sm font-semibold text-white/70">Let&apos;s cook</p>
            <h2 className="text-xl font-bold">Instructions</h2>
          </div>
        </div>
 
<ol className="mt-5 space-y-5">
  {displaySteps.map((step, index) => (
    <li key={index} className="flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f5d98b] text-sm font-bold text-[#193c2d]">
        {index + 1}
      </span>
 
      <p className="text-sm leading-6 text-white/90">{step}</p>
    </li>
  ))}
</ol>
      </section>
 
      <section className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#e6dfd0]">
        <h2 className="text-xl font-bold">How did it turn out?</h2>
        <p className="mt-1 text-sm text-[#6b7d70]">Rate this recipe and show off your version.</p>
 
        <div className="mt-4">
          <ReactionButtons recipeId={recipe.id} />
        </div>
 
        <div className="mt-5">
          <AddPhotos recipeId={recipe.id} />
        </div>
      </section>
 
      {recipe.sourceUrl && (
        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex w-full items-center justify-center rounded-2xl border-2 border-[#193c2d] px-5 py-3 text-sm font-bold text-[#193c2d] transition hover:bg-[#193c2d] hover:text-white"
        >
          View original recipe ↗
        </a>
      )}
    </article>
  );
}