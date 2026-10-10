import RecipeCard from "@/components/RecipeCard";

export default function NewMealPage() {
  const recipes = [
    {
      id: 1,
      name: "Chicken Stir-Fry",
      image: "/stirfry.jpg",
      category: "placeholder",
    },
    {
      id: 2,
      name: "Avocado Toast",
      image: "/avocadotoast.jpg",
      category: "placeholder",
    },
    {
      id: 3,
      name: "Creamy Tomato Pasta",
      image: "/pasta.jpg",
      category: "placeholder",
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Recipes for You
      </h1>

      <div className="flex flex-col gap-4">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            name={recipe.name}
            image={recipe.image}
            category={recipe.category}
          />
        ))}
      </div>
    </div>
  );
}