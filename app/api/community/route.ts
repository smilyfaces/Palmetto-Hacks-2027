import { communityPool, communityConfigured } from "@/lib/communityDb";
import { pool as recipesPool } from "@/lib/db";
 
// Whitelisted, so the tab value is never placed into SQL directly
const TABS = {
  liked: { where: "likes > 0", order: "likes DESC, dislikes ASC" },
  disliked: { where: "dislikes > 0", order: "dislikes DESC, likes ASC" },
  popular: { where: "(likes + dislikes) > 0 OR jsonb_array_length(photos::jsonb) > 0", order: "(likes + dislikes) DESC" },
} as const;
 
export async function GET(req: Request) {
  if (!communityConfigured()) {
    return Response.json({ error: "The community database isn't set up yet (COMMUNITY_DATABASE_URL is missing)." }, { status: 500 });
  }
 
  const params = new URL(req.url).searchParams;
  const tab = (params.get("tab") ?? "liked") as keyof typeof TABS;
  const voterId = params.get("voterId") ?? "";
  if (!(tab in TABS)) return Response.json({ error: "Unknown tab" }, { status: 400 });
 
  try {
    // 1) Reactions and photos come from the community database
    const { rows } = await communityPool.query(
      `SELECT * FROM (
         SELECT COALESCE(rx.recipe_id, ph.recipe_id) AS recipe_id,
                COALESCE(rx.likes, 0)    AS likes,
                COALESCE(rx.dislikes, 0) AS dislikes,
                COALESCE(rx.my_vote, 0)  AS my_vote,
                COALESCE(ph.photos, '[]'::json) AS photos
         FROM (
           SELECT recipe_id,
                  count(*) FILTER (WHERE value = 1)::int  AS likes,
                  count(*) FILTER (WHERE value = -1)::int AS dislikes,
                  COALESCE(max(value) FILTER (WHERE voter_id = $1), 0)::int AS my_vote
           FROM recipe_reactions GROUP BY recipe_id
         ) rx
         FULL OUTER JOIN (
           SELECT recipe_id,
                  json_agg(json_build_object('id', id, 'user', display_name) ORDER BY created_at DESC) AS photos
           FROM dish_photos GROUP BY recipe_id
         ) ph ON ph.recipe_id = rx.recipe_id
       ) t
       WHERE ${TABS[tab].where}
       ORDER BY ${TABS[tab].order}
       LIMIT 30`,
      [voterId]
    );
 
    // 2) Names and images come from the recipes database. This is a read-only SELECT.
    const ids = rows.map((r) => r.recipe_id);
    const recipes = ids.length
      ? await recipesPool.query(
          "SELECT meal_id, name, category, thumbnail_url FROM recipes WHERE meal_id::text = ANY($1::text[])",
          [ids]
        )
      : { rows: [] };
    const byId = new Map(recipes.rows.map((r) => [String(r.meal_id), r]));
 
    const posts = rows
      .filter((r) => byId.has(r.recipe_id))
      .map((r) => {
        const recipe = byId.get(r.recipe_id)!;
        return {
          id: r.recipe_id,
          name: recipe.name,
          category: recipe.category ?? "",
          image: recipe.thumbnail_url ?? "",
          likes: r.likes,
          dislikes: r.dislikes,
          myVote: r.my_vote,
          photos: (r.photos as { id: string; user: string }[]).map((p) => ({
            id: p.id,
            user: p.user,
            src: `/api/photos/${p.id}`,
          })),
        };
      });
 
    return Response.json({ posts });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Couldn't load the community feed." }, { status: 500 });
  }
}
 