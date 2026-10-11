"use client";
 
import Link from "next/link";
import { useEffect, useState } from "react";
import { downscaleFile } from "@/lib/image";
import { getDisplayName, getVoterId, setDisplayName } from "@/lib/voter";
 
const MAX = 5;
 
export default function AddPhotos({ recipeId }: { recipeId: string }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "uploading" | "done">("idle");
  const [message, setMessage] = useState("");
 
  useEffect(() => setName(getDisplayName()), []);
 
  const busy = status === "processing" || status === "uploading";
 
  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX - photos.length);
    e.target.value = "";
    if (files.length === 0) return;
 
    setStatus("processing");
    setMessage("");
    const results = await Promise.allSettled(files.map(downscaleFile));
    const ok = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
    setPhotos((prev) => [...prev, ...ok].slice(0, MAX));
    setStatus("idle");
    if (ok.length < files.length) setMessage("Some photos couldn't be read. Try JPEG or PNG files.");
  }
 
  async function post() {
    setStatus("uploading");
    setMessage("");
    const displayName = name.trim() || "Home cook";
    setDisplayName(displayName);
 
    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, uploaderId: getVoterId(), displayName, images: photos }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setPhotos([]);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setMessage(err instanceof Error ? err.message : "Upload failed");
    }
  }
 
  if (status === "done") {
    return (
      <div className="rounded-2xl bg-[#e5efe6] p-4 text-sm">
        <p className="font-bold">Thanks for sharing! 🎉</p>
        <p className="mt-1 text-[#557060]">
          Your photos are live on the{" "}
          <Link href="/community" className="font-bold underline">
            Community page
          </Link>
          .
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-3 text-sm font-bold underline">
          Add more photos
        </button>
      </div>
    );
  }
 
  return (
    <div>
      <label
        className={`inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#193c2d] px-5 py-3 text-sm font-bold text-[#193c2d] ${
          busy || photos.length >= MAX ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-[#193c2d]/10"
        }`}
      >
        <span aria-hidden>📸</span>
        {status === "processing" ? "Processing…" : "Add photos of your finished dish"}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={busy || photos.length >= MAX}
          onChange={onFiles}
          className="sr-only"
        />
      </label>
 
      {photos.length > 0 && (
        <div className="mt-4">
          <ul className="flex gap-2 overflow-x-auto">
            {photos.map((src, i) => (
              <li key={i} className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Your photo ${i + 1}`} className="h-20 w-20 rounded-xl object-cover" />
                <button
                  type="button"
                  aria-label={`Remove photo ${i + 1}`}
                  onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-[#193c2d] text-xs text-white"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
 
          <label className="mt-4 block text-sm font-bold">
            Your name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="Home cook"
              className="mt-1 block w-full rounded-xl border border-[#ded7c9] px-3 py-2 text-sm font-normal outline-none focus:border-[#193c2d]"
            />
          </label>
 
          <button
            type="button"
            onClick={post}
            disabled={busy}
            className="mt-3 w-full rounded-2xl bg-[#193c2d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#285540] disabled:opacity-60"
          >
            {status === "uploading" ? "Posting…" : `Post ${photos.length} photo${photos.length === 1 ? "" : "s"}`}
          </button>
        </div>
      )}
 
      {message && (
        <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">
          {message}
        </p>
      )}
    </div>
  );
}