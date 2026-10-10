"use client";
 
import { useState } from "react";
 
type Props = {
  images: string[]; // JPEG data URLs
};
 
export default function SendToGeminiButton({ images }: Props) {
  const [sending, setSending] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [text, setText] = useState<string | null>(null); // null = nothing received yet
  const [error, setError] = useState("");
 
  const empty = images.length === 0;
  const disabled = empty || sending;
 
  async function send() {
    setSending(true);
    setError("");
    setText(null);
    try {
      const res = await fetch("/api/test-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
 
      console.log("Gemini replied:", data.text);
      setText(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    }
    setSending(false);
  }
 
  return (
    <div>
      <style>{`@keyframes gemini-spin { to { transform: rotate(360deg); } }`}</style>
 
      <button
        type="button"
        onClick={send}
        disabled={disabled}
        aria-busy={sending}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          border: "1px solid currentColor",
          borderRadius: 6,
          background: "transparent",
          color: "inherit",
          font: "inherit",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transform: pressed && !disabled ? "scale(0.97)" : "none",
          transition: "transform 80ms",
        }}
      >
        {sending && (
          <span
            aria-hidden
            style={{
              width: 14,
              height: 14,
              border: "2px solid currentColor",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "gemini-spin 0.7s linear infinite",
            }}
          />
        )}
        {sending
            //${empty ? "" : images.length + " "}image${images.length === 1 ? "" : "s"}
          ? "Loading Recipes..."
          : `Find Recipes`}
      </button>
 
      {empty && !sending && (
        <p style={{ fontSize: 14, opacity: 0.7, marginTop: 6 }}>Upload at least one image first.</p>
      )}
 
      <div aria-live="polite">
        {error && (
          <p role="alert" style={{ marginTop: 6 }}>
            {error}
          </p>
        )}
 
        {/* The returned text from Gemini, printed as-is */}
        {text !== null && (
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
            {text || "(Gemini returned an empty response)"}
          </pre>
        )}
      </div>
    </div>
  );
}
 
 