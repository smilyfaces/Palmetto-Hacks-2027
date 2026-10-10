const PROMPT =
  "These are photos of a fridge or pantry. List every distinct food item you can see. " +
  "Respond with only a JSON array of strings, like [\"eggs\", \"milk\"].";

export async function POST(req: Request) {
    //key stored in .env.local file
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
  }

  const { images } = await req.json();
  if (!Array.isArray(images) || images.length === 0) {
    return Response.json({ error: "No images were sent" }, { status: 400 });
  }

  // Turn each "data:image/jpeg;base64,...." string into a Gemini image part
  const imageParts = (images as string[]).map((dataUrl) => {
    const [meta, data] = dataUrl.split(",");
    const mime = meta.match(/data:(.*?);base64/)?.[1] ?? "image/jpeg";
    return { inline_data: { mime_type: mime, data } };
  });

  const model = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({ contents: [{ parts: [{ text: PROMPT }, ...imageParts] }] }),
    }
  );

  const json = await res.json();
  if (!res.ok) {
    return Response.json(
      { error: json?.error?.message ?? "Gemini request failed" },
      { status: res.status }
    );
  }

  const parts: { text?: string }[] = json.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => p.text ?? "").join("");
  return Response.json({ text });
}