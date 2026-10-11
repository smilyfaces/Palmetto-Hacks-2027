"use client";
 
import { useEffect, useState } from "react";
import CommunityPost from "@/components/CommunityPost";
import type { CommunityPostData } from "@/lib/communityTypes";
import { getVoterId } from "@/lib/voter";
 
type TabId = "liked" | "disliked" | "popular";
 
const TABS: { id: TabId; label: string; emoji: string; blurb: string }[] = [
  { id: "liked", label: "Most liked", emoji: "👍", blurb: "The dishes the community loves most." },
  { id: "disliked", label: "Most disliked", emoji: "👎", blurb: "Recipes that didn’t land for everyone." },
  { id: "popular", label: "Popular", emoji: "🔥", blurb: "What everyone is talking about right now." },
];
 
export default function CommunityPage() {
  const [tab, setTab] = useState<TabId>("liked");
  const [posts, setPosts] = useState<CommunityPostData[] | null>(null);
  const [error, setError] = useState("");
 
  useEffect(() => {
    let cancelled = false;
    setPosts(null);
    setError("");
 
    fetch(`/api/community?tab=${tab}&voterId=${encodeURIComponent(getVoterId())}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Couldn't load the community feed.");
        if (!cancelled) setPosts(data.posts);
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Something went wrong."));
 
    return () => {
      cancelled = true;
    };
  }, [tab]);
 
  const active = TABS.find((t) => t.id === tab)!;
 
  return (
    <main className="min-h-screen bg-[#f7f3ea] pb-32 pt-28 text-[#193c2d]">
      <div className="mx-auto w-full max-w-md px-4">
        <section className="rounded-[2rem] bg-[#193c2d] p-6 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f5d98b]">
            Community
          </p>
 
          <h1 className="mt-2 text-3xl font-bold leading-tight">What everyone&apos;s cooking</h1>
 
          <p className="mt-3 text-sm leading-6 text-white/80">
            See how other people&apos;s dishes turned out, and share how yours did.
          </p>
        </section>
 
        {/* Category tabs */}
        <div role="tablist" aria-label="Community categories" className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => {
            const selected = t.id === tab;
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setTab(t.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  selected
                    ? "bg-[#193c2d] text-white shadow"
                    : "bg-white text-[#193c2d] ring-1 ring-[#e6dfd0] hover:bg-[#e5efe6]"
                }`}
              >
                <span aria-hidden>{t.emoji}</span>
                {t.label}
              </button>
            );
          })}
        </div>
 
        <p className="mt-4 text-sm text-[#6b7d70]">{active.blurb}</p>
 
        {/* Feed */}
        {error ? (
          <p role="alert" className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            {error}
          </p>
        ) : posts === null ? (
          <p className="mt-6 animate-pulse text-center text-sm font-medium text-[#6b7d70]">Loading the feed…</p>
        ) : posts.length === 0 ? (
          <section className="mt-6 rounded-[2rem] bg-white px-6 py-12 text-center shadow-sm ring-1 ring-[#e6dfd0]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e5efe6] text-4xl">
              {active.emoji}
            </div>
            <h2 className="mt-6 text-xl font-bold">Nothing here yet</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#6b7d70]">
              Open a recipe and tap like or dislike, or add a photo of your finished dish, and it will show up here.
            </p>
          </section>
        ) : (
          <ul role="tabpanel" className="mt-4 space-y-5">
            {posts.map((post, i) => (
              <li key={`${tab}-${post.id}`}>
                <CommunityPost post={post} rank={i + 1} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}