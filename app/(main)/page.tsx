"use client";

import Link from "next/link";
import Milestones from "@/components/Milestones"

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-32 pt-28 text-[#193c2d]">
      <section className="mx-auto w-full max-w-sm">
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
      </section>
      <Milestones />
    </main>
  );
}