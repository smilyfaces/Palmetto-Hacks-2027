"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-32 pt-28 text-[#193c2d]">
      <section className="mx-auto w-full max-w-md">
        <div
          className="relative overflow-hidden rounded-3xl bg-cover bg-center shadow-xl"
          style={{ backgroundImage: "url('/pantry.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#173b2c]/55 via-[#173b2c]/70 to-[#102b20]/90" />
          <div className="relative min-h-[430px] p-7 text-white">

            <div className="mt-24">
              <p className="text-5xl font-medium text-[#f5d98b] text-center">
                Welcome back, Username!
              </p>

              <h1 className="mt-2 text-4xl font-bold leading-tight text-center">
                Ready to try something new?
              </h1>
            </div>

            <Link
              href="/new_meal"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f5d98b] px-5 py-4 text-base font-bold text-[#193c2d] transition hover:scale-[1.02] hover:bg-[#ffe9a8]"
            >
              <span className="text-xl">📸</span>
              Find a New Meal
            </Link>
          </div>
        </div>
        {/*
        <section className="mt-7">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-[#6b7d70]">
                How FridgeSnap works
              </p>
              <h2 className="mt-1 text-2xl font-bold">Simple from start to plate.</h2>
            </div>
          </div>
          
          <div className="mt-4 grid gap-3">
            <article className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6dfd0]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5efe6] text-2xl">
                1
              </div>
              <div>
                <h3 className="font-bold">Take a photo</h3>
                <p className="mt-1 text-sm text-[#6b7d70]">
                  Show us your fridge, pantry, or counter.
                </p>
              </div>
            </article>

            <article className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6dfd0]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5efe6] text-2xl">
                2
              </div>
              <div>
                <h3 className="font-bold">Find your ingredients</h3>
                <p className="mt-1 text-sm text-[#6b7d70]">
                  Gemini identifies the food it can see.
                </p>
              </div>
            </article>

            <article className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6dfd0]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5efe6] text-2xl">
                3
              </div>
              <div>
                <h3 className="font-bold">Get recipe ideas</h3>
                <p className="mt-1 text-sm text-[#6b7d70]">
                  Cook with what you already have first.
                </p>
              </div>
            </article>
          </div>
        </section>
        */}
      </section>
    </main>
  );
}