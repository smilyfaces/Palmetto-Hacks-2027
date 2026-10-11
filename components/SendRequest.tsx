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
  const [pressed, setPressed] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [text, setText] = useState<string | null>(null); // null = nothing received yet
  const [error, setError] = useState("");
 
  const empty = images.length === 0;
  const disabled = empty || sending;
 
  async function findRecipes() {
    setSending(true);
    setError("");
    setIngredients([]);
    setRecipes([]);
    onIngredients?.([]); // lets the page reset, so the recipe popup reopens fresh
 
    try {
      const res = await fetch("/api/test-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
 
      console.log("Gemini replied:", data.text);
      setText(data.text);
 
      const parsed = parseIngredients(data.text);
      if (parsed.length === 0) {
        throw new Error("Couldn't find any ingredients in those photos. Try clearer shots.");
      }
      setIngredients(parsed); // this is what opens the recipe popup
      onIngredients?.(parsed);
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
      <style>{`@keyframes gemini-spin { to { transform: rotate(360deg); } }`}</style>
 
      <button
        type="button"
        onClick={findRecipes}
        disabled={disabled}
        aria-busy={sending}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          border: "1px solid currentColor",
          borderRadius: 6,
          background: "transparent",
          color: "inherit",
          font: "inherit",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transform: pressed && !disabled ? "scale(0.97)" : "none",
          transition: "transform 80ms",
        }}
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
        {sending ? "Finding Recipes…" : "Find Recipes"}
      </button>
 
      {empty && !sending && (
        <p style={{ fontSize: 14, opacity: 0.7, marginTop: 6 }}>Upload at least one image first.</p>
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
        )} */}
      </div>
 
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