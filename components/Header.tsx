"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      // Always show it near the very top of the page.
      if (currentScrollY < 60) {
        setShowHeader(true);
      }
      // Scrolling down = hide it.
      else if (currentScrollY > lastScrollY.current) {
        setShowHeader(false);
      }
      // Scrolling up = show it again.
      else {
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`absolute left-0 right-0 top-0 z-40 flex h-20 items-center justify-between transition-all duration-300 ${
        showHeader
          ? "translate-y-0 opacity-100"
          : "-translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <Image
        src="/logo.png"
        alt="FridgeSnap logo"
        width={1254}
        height={1254}
        className="h-auto w-18 aspect-square object-contain"
      />

<button
  type="button"
  aria-label="Account"
  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#193c2d] shadow-md transition hover:scale-105 hover:bg-white"
>
  <svg
    viewBox="0 0 24 24"
    className="h-8 w-8"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3Zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22Z" />
  </svg>
</button>
    </header>
  );
}
