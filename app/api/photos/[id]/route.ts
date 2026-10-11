import { communityPool as pool } from "@/lib/communityDb";
 
// Serves one stored photo
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });
 
  try {
    const { rows } = await pool.query("SELECT mime_type, data FROM dish_photos WHERE id = $1", [id]);
    if (!rows[0]) return new Response("Not found", { status: 404 });
 
    return new Response(new Uint8Array(rows[0].data), {
      headers: {
        "Content-Type": rows[0].mime_type,
        "Cache-Control": "public, max-age=31536000, immutable", // a photo never changes once saved
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}