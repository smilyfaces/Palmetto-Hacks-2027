"use client";
 
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import ReactionButtons from "@/components/ReactionButtons";
import type { CommunityPostData } from "@/lib/communityTypes";
 
type Props = { post: CommunityPostData; rank: number };
 
export default function CommunityPost({ post, rank }: Props) {
  const strip = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
 
  const [counts, setCounts] = useState({ likes: post.likes, dislikes: post.dislikes });
 
  const total = counts.likes + counts.dislikes;
  const percentLiked = total === 0 ? 0 : Math.round((counts.likes / total) * 100);
 
  // Show an arrow only when there's more to scroll in that direction
  function updateArrows() {
    const el = strip.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }
 
  useEffect(updateArrows, []);
 
  function scrollBy(direction: -1 | 1) {
    const el = strip.current;
    el?.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
  }
 
  return (
    <article className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-[#e6dfd0]">
      {/* Photo strip: several small photos side by side, swipe or use the arrows to see more */}
      {post.photos.length > 0 && (
      <div className="relative px-3 pt-3">
        <div
          ref={strip}
          onScroll={updateArrows}
          className="flex snap-x snap-proximity gap-2 overflow-x-auto rounded-xl scroll-pl-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={`Photos of ${post.name} made by the community`}
        >
          {post.photos.map((photo) => (
            <div
              key={photo.id}
              className="relative h-32 w-40 shrink-0 snap-start overflow-hidden rounded-xl"
            >
              {photo.src ? (
                <Image
                  src={photo.src}
                  alt={`${post.name} made by ${photo.user}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              ) : (
                <div
                  className="grid h-full w-full place-items-center text-5xl"
                  style={{ background: `linear-gradient(135deg, ${photo.from ?? "#cbd6ca"}, ${photo.to ?? "#83a98b"})` }}
                  role="img"
                  aria-label={`Placeholder photo of ${post.name} by ${photo.user}`}
                >
                  <span aria-hidden>{photo.emoji ?? "🍽️"}</span>
                </div>
              )}
 
              <span className="absolute bottom-1.5 left-1.5 max-w-[calc(100%-0.75rem)] truncate rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-semibold text-white">
                @{photo.user}
              </span>
            </div>
          ))}
        </div>
 
        <span className="absolute left-5 top-5 rounded-full bg-[#f5d98b] px-2.5 py-1 text-xs font-bold text-[#193c2d] shadow">
          #{rank}
        </span>
 
        {canLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll photos left"
            className="absolute left-4 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg shadow hover:bg-white"
          >
            ‹
          </button>
        )}
        {canRight && (
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll photos right"
            className="absolute right-4 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg shadow hover:bg-white"
          >
            ›
          </button>
        )}
      </div>
      )}
 
      {/* Compact recipe card and reactions */}
      <div className="p-3">
        <RecipeCard id={post.id} name={post.name} image={post.image} category={post.category} compact />
 
        <div className="mt-3 flex items-center gap-2">
          <ReactionButtons
            recipeId={post.id}
            size="sm"
            initial={{ likes: post.likes, dislikes: post.dislikes, myVote: post.myVote ?? 0 }}
            onChange={(r) => setCounts({ likes: r.likes, dislikes: r.dislikes })}
          />
          {post.photos.length > 0 && (
            <span className="ml-auto text-xs font-semibold text-[#6b7d70]">
              {post.photos.length} {post.photos.length === 1 ? "photo" : "photos"}
            </span>
          )}
        </div>
 
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-rose-200">
            <div className="h-full rounded-full bg-[#83a98b]" style={{ width: `${percentLiked}%` }} />
          </div>
          <span className="text-xs font-semibold text-[#6b7d70]">{percentLiked}% liked</span>
        </div>
      </div>
    </article>
  );
}