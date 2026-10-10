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

      <Image
        src="/tier.png"
        alt="User tier"
        width={447}
        height={447}
        className="h-auto w-18 aspect-square object-contain"
      />
    </header>
  );
}