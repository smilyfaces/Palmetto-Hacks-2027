import Image from "next/image";
 
type RecipeCardProps = {
  name: string;
  image: string;
  category: string;
  missingCount?: number; // how many ingredients you still need; the badge is hidden if omitted
};
 
const SCALE_MAX = 3; // this many missing (or more) is fully red; matches the route's default limit
 
// 0 missing = green, SCALE_MAX or more = red, with orange/yellow in between
function missingColor(count: number) {
  const t = Math.min(count, SCALE_MAX) / SCALE_MAX;
  const hue = Math.round(120 * (1 - t));
  return `hsl(${hue} 70% 34%)`;
}
 
export default function RecipeCard({
  name,
  image,
  category,
  missingCount
}: RecipeCardProps) {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-gray-200 shadow-md">
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
 
      {/* Recipe information */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <h2 className="text-xl font-bold text-white">
          {name}
        </h2>
 
        {category && (
          <span className="shrink-0 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-900">
            {category}
          </span>
        )}
      </div>
    </div>
  );
}
 