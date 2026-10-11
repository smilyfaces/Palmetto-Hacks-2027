import Image from "next/image";
import Link from "next/link";
import SaveButton from "@/components/SaveButton";
 
type RecipeCardProps = {
  id?: string; // when given, the card links to /recipe/[id] and shows a save button
  name: string;
  image: string;
  category: string;
  missingIngrediants?: string[];
  missingCount?: number; // how many ingredients you still need; the badge is hidden if omitted
  compact?: boolean; // a shorter card, used in the community feed
};
 
const SCALE_MAX = 3; // this many missing (or more) is fully red; matches the route's default limit
 
// 0 missing = green, SCALE_MAX or more = red, with orange/yellow in between
function missingColor(count: number) {
  const t = Math.min(count, SCALE_MAX) / SCALE_MAX;
  const hue = Math.round(120 * (1 - t));
  return `hsl(${hue} 70% 34%)`;
}
 
export default function RecipeCard({
  id,
  name,
  image,
  category,
  missingCount,
  missingIngrediants,
  compact = false
}: RecipeCardProps) {
  const card = (
    <div
      className={`relative ${compact ? "h-24" : "h-56"} w-full overflow-hidden rounded-2xl bg-gray-200 shadow-md`}
    >
      {/* Recipe image (the grey background shows if a recipe has no photo) */}
      {image && (
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
      )}
 
      {/* Dark gradient to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
 
      {/* Missing ingredients badge */}
      {missingCount !== undefined && (
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-semibold text-white shadow"
          style={{ backgroundColor: missingColor(missingCount) }}
        >
          {missingCount === 0 ? "You have it all" : `${missingCount} missing`}
        </span>
      )}

      {missingIngrediants && missingIngrediants.length > 0 && (
      <div className="absolute left-3 top-14 z-20 flex max-w-[80%] flex-col items-start gap-1">
      {missingIngrediants.map((ingredient, index) => (
        <span
          key={`${ingredient}-${index}`}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 py-1 pl-1.5 pr-3 text-sm font-semibold text-white shadow-md"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-red-600 text-base font-bold leading-none">
            ×
          </span>
          {ingredient}
        </span>
      ))}
    </div>
    )}
 
      {/* Recipe information */}
      <div
        className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 ${compact ? "p-3" : "p-4"}`}
      >
        <h2 className={`${compact ? "text-base leading-tight" : "text-xl"} font-bold text-white`}>
          {name}
        </h2>
 
        {category && (
          <span
            className={`shrink-0 rounded-full bg-white/90 font-medium text-gray-900 ${
              compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
            }`}
          >
            {category}
          </span>
        )}
      </div>
    </div>
  );
 
  if (!id) return card;
 
  // The save button is a sibling of the link (not inside it), which keeps the HTML valid
  return (
    <div className="relative">
      <Link href={`/recipe/${id}`} className="block">
        {card}
      </Link>
      <SaveButton
        recipe={{ id, name, image, category }}
        small={compact}
        className={`absolute ${compact ? "right-2 top-2" : "right-3 top-3"}`}
      />
    </div>
  );
}
 