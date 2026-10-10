"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "New Meal", href: "/new_meal" },
  { label: "Saved", href: "/saved" },
  { label: "Community", href: "/community" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <div className="mx-auto flex max-w-lg items-center justify-around rounded-2xl bg-white/95 px-2 py-3 shadow-lg ring-1 ring-[#e6dfd0] backdrop-blur-md">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <Fragment key={item.href}>
              <Link
                href={item.href}
                className={`rounded-xl px-3 py-2 text-center text-xs font-bold transition sm:px-4 sm:text-sm ${
                  isActive
                    ? "bg-[#e5efe6] text-[#193c2d]"
                    : "text-[#6b7d70] hover:bg-[#f7f3ea] hover:text-[#193c2d]"
                }`}
              >
                {item.label}
              </Link>

              {index < navItems.length - 1 && (
                <div
                  className="h-7 w-px bg-[#d8dfd9]"
                  aria-hidden="true"
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}