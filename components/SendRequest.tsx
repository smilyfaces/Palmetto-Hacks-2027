"use client";

import { useState } from "react";

type Recipe = {
  title: string;
  description: string;
  timeMinutes: number;
  ingredientsUsed: string[];
  missingIngredients: string[];
  steps: string[];
};

type Props = {
  images: string[];
};

export default function SendToGeminiButton({ images }: Props) {
  const [sending, setSending] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState("");

  async function findRecipes() {
    setSending(true);
    setError("");
    setIngredients([]);
    setRecipes([]);

    try {
      const visionResponse = await fetch("/api/test-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });

      const visionData = await visionResponse.json();

      if (!visionResponse.ok) {
        throw new Error(visionData.error ?? "Could not analyze the images.");
      }

      const ingredientMatch = visionData.text.match(/\[[\s\S]*\]/);

      if (!ingredientMatch) {
        throw new Error("Gemini could not find ingredients. Try a clearer photo.");
      }

      const foundIngredients = JSON.parse(ingredientMatch[0]);

      if (!Array.isArray(foundIngredients)) {
        throw new Error("Gemini returned an invalid ingredient list.");
      }

      setIngredients(foundIngredients);

      const recipeResponse = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: foundIngredients,
          preference: "quick, affordable, college-student friendly meals",
        }),
      });

      const recipeData = await recipeResponse.json();

      if (!recipeResponse.ok) {
        throw new Error(recipeData.error ?? "Could not generate recipes.");
      }

      setRecipes(recipeData.recipes ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section style={{ width: "100%", maxWidth: 720 }}>
      <button
        type="button"
        onClick={findRecipes}
        disabled={images.length === 0 || sending}
      >
        {sending ? "Finding ingredients and recipes..." : "Find Recipes"}
      </button>

      {error && <p role="alert">{error}</p>}

      {ingredients.length > 0 && (
        <div>
          <h2>Ingredients Gemini found</h2>
          <p>{ingredients.join(", ")}</p>
        </div>
      )}

      {recipes.length > 0 && (
        <div>
          <h2>Recipes you can make</h2>

          {recipes.map((recipe) => (
            <article key={recipe.title}>
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <p>
                <strong>Time:</strong> {recipe.timeMinutes} minutes
              </p>
              <p>
                <strong>Uses:</strong> {recipe.ingredientsUsed.join(", ")}
              </p>
              <p>
                <strong>Optional extras:</strong>{" "}
                {recipe.missingIngredients.join(", ")}
              </p>

              <ol>
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}