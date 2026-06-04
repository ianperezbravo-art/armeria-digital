"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar({ initialQuery }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    router.push(`/?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="relative max-w-lg">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar pistolas, rifles, accesorios..."
        className="input pl-10 pr-4"
      />
    </form>
  );
}
