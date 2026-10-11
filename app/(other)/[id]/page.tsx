import { Suspense } from "react";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import { getRecipe } from "@/lib/recipes";
 
// The page shell (back button, loading message) renders instantly.
// Reading the id and querying the database happen inside <Suspense>, so they stream in.
export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="mx-auto max-w-lg px-4 pb-28 pt-24">
      <BackButton />
      <Suspense fallback={<p className="mt-6 text-gray-500">Loading recipe…</p>}>
        <RecipeContent params={params} />
      </Suspense>
    </main>
  );
}
 
async function RecipeContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();
 
  const subtitle = [recipe.category, recipe.area].filter(Boolean).join(" · ");
 
  return (
    <>
      {recipe.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.thumbnailUrl}
          alt={recipe.name}
          className="mt-4 w-full rounded-2xl object-cover"
        />
      )}
 
      <h1 className="mt-4 text-2xl font-bold">{recipe.name}</h1>
      {subtitle && <p className="text-gray-500">{subtitle}</p>}
 
      <h2 className="mt-6 text-lg font-semibold">Ingredients</h2>
      <ul className="mt-2 space-y-1">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>
            {ing.measure && <span className="font-medium">{ing.measure} </span>}
            {ing.name}
          </li>
        ))}
      </ul>
 
      <h2 className="mt-6 text-lg font-semibold">Instructions</h2>
      <ol className="mt-2 list-decimal space-y-3 pl-5">
        {recipe.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
 
      {recipe.sourceUrl && (
        <p className="mt-6 text-sm">
          <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="text-green-800 underline">
            Original source
          </a>
        </p>
      )}
    </>
  );
}
 
 