"use client";

import Link from "next/link";



export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat px-4"
          style={{ backgroundImage: "url('/pantry.jpg')"}}>
      <h1 className="bg-black px-2 py-2 text-center text-3xl font-bold rounded-md">
        Welcome Back, Username!
      </h1>

      <Link
        href="/new_meal"
        className="rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-green-700"
      >
        Start a New Meal
      </Link>
    </main>
  );
} 
