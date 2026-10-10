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
  images: string[]; // JPEG data URLs
  onIngredients?: (ingredients: string[]) => void; // the parsed list, once Gemini replies
};
 
// Gemini sometimes wraps its JSON in ```json fences even when told not to
function parseIngredients(text: string): string[] {
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
 
export default function SendToGeminiButton({ images, onIngredients }: Props) {
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
 
      console.log("Gemini replied:", data.text);
      setText(data.text);
      onIngredients?.(parseIngredients(data.text));
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
        {sending && (
          <span
            aria-hidden
            style={{
              width: 14,
              height: 14,
              border: "2px solid currentColor",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "gemini-spin 0.7s linear infinite",
            }}
          />
        )}
        {sending
          ? "Find Recipes…"
          : `Load Recipes`}
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
 
      <div aria-live="polite">
        {error && (
          <p role="alert" style={{ marginTop: 6 }}>
            {error}
          </p>
        )}
        
        {/* The returned text from Gemini, printed as-is 
        {text !== null && (
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
            {text || "(Gemini returned an empty response)"}
          </pre>
        )}*/}
      </div>
    </div>
  );
}