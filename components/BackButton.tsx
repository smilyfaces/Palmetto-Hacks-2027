"use client";
 
import { useRouter } from "next/navigation";
 
export default function BackButton({ fallbackHref = "/new_meal" }: { fallbackHref?: string }) {
  const router = useRouter();
 
  function goBack() {
    // If the page was opened directly (no history), go to the fallback instead of leaving the site
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  }
 
  return (
    <button
      type="button"
      onClick={goBack}
      className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
    >
      ← Back
    </button>
  );
}