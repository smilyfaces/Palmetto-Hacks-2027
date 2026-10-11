import { communityPool as pool, communityConfigured } from "@/lib/communityDb";
 
const NOT_READY = { error: "The community database isn't set up yet (COMMUNITY_DATABASE_URL is missing)." };
 
async function summary(recipeId: string, voterId: string) {
  const { rows } = await pool.query(
    `SELECT count(*) FILTER (WHERE value = 1)::int  AS likes,
            count(*) FILTER (WHERE value = -1)::int AS dislikes,
            COALESCE(max(value) FILTER (WHERE voter_id = $2), 0)::int AS my_vote
     FROM recipe_reactions WHERE recipe_id = $1`,
    [recipeId, voterId]
  );
  return { likes: rows[0].likes, dislikes: rows[0].dislikes, myVote: rows[0].my_vote };
}
 
// Counts for one recipe, plus this device's vote
export async function GET(req: Request) {
  if (!communityConfigured()) return Response.json(NOT_READY, { status: 500 });
  const params = new URL(req.url).searchParams;
  const recipeId = params.get("recipeId") ?? "";
  const voterId = params.get("voterId") ?? "";
  if (!recipeId) return Response.json({ error: "recipeId is required" }, { status: 400 });
 
  try {
    return Response.json(await summary(recipeId, voterId));
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Couldn't load reactions." }, { status: 500 });
  }
}
 
// value: 1 = like, -1 = dislike, 0 = remove my vote
export async function POST(req: Request) {
  if (!communityConfigured()) return Response.json(NOT_READY, { status: 500 });
  const { recipeId, voterId, value } = await req.json();
  if (
    typeof recipeId !== "string" || !recipeId || recipeId.length > 100 ||
    typeof voterId !== "string" || !voterId || voterId.length > 100 ||
    ![-1, 0, 1].includes(value)
  ) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
 
  try {
    if (value === 0) {
      await pool.query("DELETE FROM recipe_reactions WHERE recipe_id = $1 AND voter_id = $2", [recipeId, voterId]);
    } else {
      await pool.query(
        `INSERT INTO recipe_reactions (recipe_id, voter_id, value) VALUES ($1, $2, $3)
         ON CONFLICT (recipe_id, voter_id) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [recipeId, voterId, value]
      );
      await pool.query("INSERT INTO reaction_events (recipe_id, voter_id, value) VALUES ($1, $2, $3)", [recipeId, voterId, value]);
    }
    return Response.json(await summary(recipeId, voterId));
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Couldn't save your reaction." }, { status: 500 });
  }
}