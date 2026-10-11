"use client";
 
import { useEffect, useState } from "react";
import { getVoterId } from "@/lib/voter";
 
export type ReactionState = { likes: number; dislikes: number; myVote: -1 | 0 | 1 };
 
type Props = {
  recipeId: string;
  initial?: ReactionState; // when given (e.g. from the community feed), no extra request is made on load
  size?: "sm" | "md"; // sm = counts only, md = counts with labels
  onChange?: (state: ReactionState) => void;
};
 
export default function ReactionButtons({ recipeId, initial, size = "md", onChange }: Props) {
  const [state, setState] = useState<ReactionState>(initial ?? { likes: 0, dislikes: 0, myVote: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
 
  // Load the counts and this device's vote when nobody gave us starting values
  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    fetch(`/api/reactions?recipeId=${encodeURIComponent(recipeId)}&voterId=${encodeURIComponent(getVoterId())}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data.likes === "number") setState(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);
 
  async function vote(target: 1 | -1) {
    if (busy) return;
    const previous = state;
    const next: -1 | 0 | 1 = previous.myVote === target ? 0 : target; // tapping your own vote again removes it
 
    // Update the numbers immediately, then confirm with the server
    const optimistic: ReactionState = {
      likes: previous.likes - (previous.myVote === 1 ? 1 : 0) + (next === 1 ? 1 : 0),
      dislikes: previous.dislikes - (previous.myVote === -1 ? 1 : 0) + (next === -1 ? 1 : 0),
      myVote: next,
    };
    setState(optimistic);
    onChange?.(optimistic);
    setBusy(true);
    setError(false);
 
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, voterId: getVoterId(), value: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setState(data);
      onChange?.(data);
    } catch {
      setState(previous); // roll back
      onChange?.(previous);
      setError(true);
    }
    setBusy(false);
  }
 
  const pill = `inline-flex items-center gap-1.5 rounded-full text-sm font-bold transition active:scale-95 disabled:opacity-60 ${
    size === "sm" ? "px-3 py-1" : "px-4 py-2.5"
  }`;
 
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => vote(1)}
        disabled={busy}
        aria-pressed={state.myVote === 1}
        aria-label={`Like (${state.likes})`}
        className={`${pill} ${state.myVote === 1 ? "bg-[#193c2d] text-white" : "bg-[#e5efe6] text-[#193c2d] hover:bg-[#d3e4d6]"}`}
      >
        <span aria-hidden>👍</span>
        {size === "md" && "Likes "}
        {state.likes.toLocaleString()}
      </button>
 
      <button
        type="button"
        onClick={() => vote(-1)}
        disabled={busy}
        aria-pressed={state.myVote === -1}
        aria-label={`Dislike (${state.dislikes})`}
        className={`${pill} ${state.myVote === -1 ? "bg-rose-700 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"}`}
      >
        <span aria-hidden>👎</span>
        {size === "md" && "Dislikes "}
        {state.dislikes.toLocaleString()}
      </button>
 
      {error && (
        <span role="alert" className="text-xs font-semibold text-rose-700">
          Couldn&apos;t save that
        </span>
      )}
    </div>
  );
}
 