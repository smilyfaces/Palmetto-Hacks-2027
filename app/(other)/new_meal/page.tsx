"use client";

import Link from "next/link";
import { useState } from "react";
import CameraFeed from "@/components/CameraFeed";
import ImageUpload from "@/components/ImageUpload";
import SendToGeminiButton from "@/components/SendRequest";
import RecipeList from "@/components/RecipeList";
import RecipeModal from "@/components/RecipeModal";

export default function NewMealPage() {
  const [images, setImages] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-[#f7f3ea] pb-32 pt-28 text-[#193c2d]">
      <div className="mx-auto w-full max-w-md px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#557060] transition hover:text-[#193c2d]"
        >
          ← Back home
        </Link>

        <section className="mt-5 rounded-[2rem] bg-[#193c2d] p-6 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f5d98b]">
            FridgeSnap
          </p>

          <h1 className="mt-2 text-3xl font-bold leading-tight">
            What are we cooking today?
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/80">
            Take a photo of what you have, or upload one from your phone. We’ll
            find the ingredients and build recipe ideas around them.
          </p>
        </section>

        <section className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#e6dfd0]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5efe6] text-xl">
              📸
            </div>

            <div>
              <h2 className="font-bold">Take a photo</h2>
              <p className="text-sm text-[#6b7d70]">
                Use your camera to scan your ingredients.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <CameraFeed
              onCapture={(img) => setImages((previous) => [...previous, img])}
            />
          </div>
        </section>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#ded7c9]" />
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#829084]">
            or
          </p>
          <div className="h-px flex-1 bg-[#ded7c9]" />
        </div>

        <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#e6dfd0]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1c9] text-xl">
              🖼️
            </div>

            <div>
              <h2 className="font-bold">Upload a photo</h2>
              <p className="text-sm text-[#6b7d70]">
                Choose an existing fridge or pantry photo.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <ImageUpload images={images} onChange={setImages} />
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] bg-[#e5efe6] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Photos ready to scan</p>
              <p className="mt-1 text-sm text-[#557060]">
                {images.length === 0
                  ? "Add at least one photo to continue."
                  : `${images.length} photo${images.length === 1 ? "" : "s"} added.`}
              </p>
            </div>

            <span className="text-2xl">🥕</span>
          </div>

          <div className="mt-4">
            <SendToGeminiButton
              images={images}
              onIngredients={setIngredients}
            />
          </div>
        </section>

        {ingredients.length > 0 && (
          <section className="mt-7">
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#6b7d70]">
                Your personalized ideas
              </p>
              <h2 className="text-2xl font-bold">Recipes to try</h2>
            </div>

            <RecipeModal ingredients={ingredients} />
          </section>
        )}
      </div>
    </main>
  );
}