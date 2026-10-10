
"use client";

import BottomNav from "@/components/BottomNav";
import { useState } from "react";
import Image from "next/image";
import CameraFeed from "@/components/camera-feed";
import ImageUpload from "@/components/image-upload";
import SendToGeminiButton from "@/components/send-request";

export default function new_meal_page() {
    const [images, setImages] = useState<string[]>([]);
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            New Meal
          </h1>
          <CameraFeed onCapture={(img) => console.log(img.slice(0, 40))} />;
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <ImageUpload images={images} onChange={setImages} />
          <SendToGeminiButton images={images} />
        </div>
      </main>
    </div>
  );
}