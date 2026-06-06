"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  const searchParams = useSearchParams();

  function buildHref(slug?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    const str = params.toString();
    return str ? `/?${str}` : "/";
  }

  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
      <Link
        href={buildHref()}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
          !activeSlug
            ? "bg-brand-600 text-white border-brand-600"
            : "bg-white text-gray-700 border-gray-300 hover:border-brand-400 hover:text-brand-600"
        )}
      >
        Todos
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={buildHref(cat.slug)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
            activeSlug === cat.slug
              ? "bg-brand-600 text-white border-brand-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-brand-400 hover:text-brand-600"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
