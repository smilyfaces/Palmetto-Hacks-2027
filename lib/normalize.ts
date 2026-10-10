export function normalize(raw: string): string {
  let s = raw.toLowerCase().trim().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ");
  if (s.endsWith("ies")) s = s.slice(0, -3) + "y"; // berries -> berry
  else if (s.endsWith("oes")) s = s.slice(0, -2); // tomatoes -> tomato
  else if (s.endsWith("s") && !s.endsWith("ss")) s = s.slice(0, -1); // eggs -> egg
  return s;
}
 
// Ingredients we assume everyone has, so they never count as "missing"
export const STAPLES = new Set(["salt", "pepper", "black pepper", "sea salt", "water"]);