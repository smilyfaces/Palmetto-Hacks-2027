"use client";
 
import { useState } from "react";
 
const MAX_SIDE = 1024; // longest edge after downscaling, in pixels
const QUALITY = 0.8; // JPEG quality (0 to 1)
const MAX_IMAGES = 12;
 
type Props = {
  images: string[]; // downscaled JPEG data URLs, owned by the parent
  onChange: (images: string[]) => void;
};
 
async function loadImage(file: File): Promise<{ source: CanvasImageSource; w: number; h: number; close: () => void }> {
  try {
    const bmp = await createImageBitmap(file);
    return { source: bmp, w: bmp.width, h: bmp.height, close: () => bmp.close() };
  } catch {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, w: img.naturalWidth, h: img.naturalHeight, close: () => URL.revokeObjectURL(url) };
  }
}
 
async function downscale(file: File): Promise<string> {
  const { source, w, h, close } = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h)); // never upscale
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext("2d")!.drawImage(source, 0, 0, canvas.width, canvas.height);
  close();
  return canvas.toDataURL("image/jpeg", QUALITY);
}
 
// Visually hidden but still focusable, so keyboard users can reach the picker
const visuallyHidden: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};
 
export default function ImageUpload({ images, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
 
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    e.target.value = ""; // lets the user pick the same file again later
    if (files.length === 0) return;
 
    setError("");
    setBusy(true);
 
    // allSettled: one unreadable file doesn't throw away the good ones
    const results = await Promise.allSettled(files.map(downscale));
    const ok = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
    const failed = results.length - ok.length;
 
    onChange([...images, ...ok].slice(0, MAX_IMAGES));
 
    if (failed > 0) {
      setError(`${failed} image${failed > 1 ? "s" : ""} couldn't be read. Try JPEG or PNG files.`);
    } else if (images.length + ok.length > MAX_IMAGES) {
      setError(`Only the first ${MAX_IMAGES} images are kept.`);
    }
    setBusy(false);
  }
 
  const full = images.length >= MAX_IMAGES;
 
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* A label wrapping the input opens the picker natively, which is the most reliable approach on iOS Safari */}
        <label
          style={{
            display: "inline-block",
            padding: "6px 12px",
            border: "1px solid currentColor",
            borderRadius: 6,
            cursor: busy || full ? "not-allowed" : "pointer",
            opacity: busy || full ? 0.5 : 1,
          }}
        >
          {busy ? "Processing…" : full ? "Image limit reached" : "Upload images"}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={busy || full}
            onChange={handleChange}
            style={visuallyHidden}
          />
        </label>
 
        {images.length > 0 && (
          <button type="button" onClick={() => onChange([])} disabled={busy}>
            Clear
          </button>
        )}
        <span>
          {images.length} / {MAX_IMAGES}
        </span>
      </div>
 
      {error && <p role="alert">{error}</p>}
 
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {images.map((src, i) => (
          <div key={i} style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Upload ${i + 1}`}
              style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 8, display: "block" }}
            />
            <button
              type="button"
              aria-label={`Remove image ${i + 1}`}
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              style={{ position: "absolute", top: 2, right: 2 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
 
 