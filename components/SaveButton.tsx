"use client";
 
import { toggleSaved, useSavedRecipes, type SavedRecipe } from "@/lib/savedRecipes";
 
type Props = {
  recipe: Omit<SavedRecipe, "savedAt">;
  variant?: "icon" | "full"; // icon = round heart for cards, full = labeled button for the recipe page
  small?: boolean; // a smaller heart, for compact cards
  className?: string;
};
 
export default function SaveButton({ recipe, variant = "icon", small = false, className = "" }: Props) {
  const { isSaved, ready } = useSavedRecipes();
  const saved = ready && isSaved(recipe.id);
 
  function onClick(e: React.MouseEvent) {
    e.preventDefault(); // in case the button ever sits inside a link
    e.stopPropagation();
    toggleSaved(recipe);
  }
 
  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className={`inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#193c2d] px-5 py-3 text-sm font-bold transition active:scale-[0.97] ${
          saved ? "bg-[#193c2d] text-white" : "bg-transparent text-[#193c2d] hover:bg-[#193c2d]/10"
        } ${className}`}
      >
        <span aria-hidden className="text-lg leading-none">{saved ? "♥" : "♡"}</span>
        {saved ? "Saved" : "Save recipe"}
      </button>
    );
  }
 
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${recipe.name} from saved recipes` : `Save ${recipe.name}`}
      className={`grid ${small ? "size-7 text-base" : "size-9 text-xl"} place-items-center rounded-full bg-white/90 leading-none shadow transition active:scale-90 ${
        saved ? "text-rose-600" : "text-gray-800"
      } ${className}`}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}