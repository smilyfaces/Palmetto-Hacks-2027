import { communityPool as pool, communityConfigured } from "@/lib/communityDb";
 
const MAX_PHOTOS = 5;
const MAX_BYTES = 600_000; // per photo, after the browser has shrunk it
 
// Accepts only real JPEG or PNG data (checks the file's first bytes, not just what the browser claims)
function decode(dataUrl: unknown) {
  if (typeof dataUrl !== "string") return null;
  const match = /^data:(image\/(?:jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) return null;
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length < 100 || bytes.length > MAX_BYTES) return null;
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  return isJpeg || isPng ? { mime: match[1], bytes } : null;
}
 
export async function POST(req: Request) {
  if (!communityConfigured()) {
    return Response.json({ error: "The community database isn't set up yet (COMMUNITY_DATABASE_URL is missing)." }, { status: 500 });
  }
 
  const { recipeId, uploaderId, displayName, images } = await req.json();
  if (
    typeof recipeId !== "string" || !recipeId || recipeId.length > 100 ||
    typeof uploaderId !== "string" || !uploaderId || uploaderId.length > 100 ||
    !Array.isArray(images) || images.length === 0 || images.length > MAX_PHOTOS
  ) {
    return Response.json({ error: `Send between 1 and ${MAX_PHOTOS} photos.` }, { status: 400 });
  }
 
  const name = (typeof displayName === "string" ? displayName.trim() : "").slice(0, 40) || "Home cook";
  const decoded = images.map(decode);
  if (decoded.some((d) => d === null)) {
    return Response.json({ error: "Photos must be JPEG or PNG files under 600 KB." }, { status: 400 });
  }
 
  try {
    for (const d of decoded) {
      await pool.query(
        "INSERT INTO dish_photos (recipe_id, uploader_id, display_name, mime_type, data) VALUES ($1, $2, $3, $4, $5)",
        [recipeId, uploaderId, name, d!.mime, d!.bytes]
      );
    }
    return Response.json({ saved: decoded.length });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Couldn't save your photos." }, { status: 500 });
  }
}