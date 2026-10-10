"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "New Meal", href: "/new_meal" },
  { label: "Past Meals", href: "/past_meals" },
  { label: "Community", href: "/community" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    // <nav className="bottom-0 left-0 z-50 w-full bg-white/0">
    <nav className="w-full bg-white/0">
      <div className="mx-auto flex max-w-lg justify-around px-4 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
