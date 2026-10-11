"use client";
 
import { useMemo, useState } from "react";
import CommunityPost from "@/components/CommunityPost";
import { COMMUNITY_POSTS } from "@/lib/communityMock";
 
type TabId = "liked" | "disliked" | "popular";
 
const TABS: { id: TabId; label: string; emoji: string; blurb: string }[] = [
  { id: "liked", label: "Most liked", emoji: "👍", blurb: "The dishes the community loves most." },
  { id: "disliked", label: "Most disliked", emoji: "👎", blurb: "Recipes that didn’t land for everyone." },
  { id: "popular", label: "Popular", emoji: "🔥", blurb: "What everyone is talking about right now." },
];
 
export default function CommunityPage() {
  const [tab, setTab] = useState<TabId>("liked");
 
  const posts = useMemo(() => {
    const list = [...COMMUNITY_POSTS];
    if (tab === "liked") list.sort((a, b) => b.likes - a.likes);
    if (tab === "disliked") list.sort((a, b) => b.dislikes - a.dislikes);
    if (tab === "popular") list.sort((a, b) => b.likes + b.dislikes - (a.likes + a.dislikes));
    return list;
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
        <ul role="tabpanel" className="mt-4 space-y-5">
          {posts.map((post, i) => (
            <li key={post.id}>
              <CommunityPost post={post} rank={i + 1} />
            </li>
          ))}
        </ul>
 
        <section className="mt-6 rounded-2xl border border-dashed border-[#cbd6ca] bg-[#edf3ed] p-5">
          <p className="text-sm font-bold">Sample data</p>
          <p className="mt-1 text-sm leading-6 text-[#557060]">
            Likes, dislikes, and photos here are placeholders. They&apos;ll come from the database once
            reactions and photo uploads are connected.
          </p>
        </section>
      </div>
    </main>
  );
}