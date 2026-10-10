import Image from "next/image";

type RecipeCardProps = {
  name: string;
  image: string;
  category: string;
};

export default function RecipeCard({
  name,
  image,
  category
}: RecipeCardProps) {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl shadow-md">
      {/* Recipe image */}
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        className="object-cover"
      />

      {/* Dark gradient to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Recipe information */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <h2 className="text-xl font-bold text-white">
          {name}
        </h2>

        <span className="shrink-0 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-900">
          {category}
        </span>
      </div>
    </div>
  );
}