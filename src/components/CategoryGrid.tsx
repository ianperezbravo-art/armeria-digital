"use client";
import Link from "next/link";
import type { Category } from "@/types";

const CATEGORY_IMAGES: Record<string, string> = {
  pistolas: "/categories/pistolas.jpg",
  rifles: "/categories/rifles.jpg",
  escopetas: "/categories/escopetas.jpg",
  revolvers: "/categories/revolvers.jpg",
  accesorios: "/categories/accesorios.jpg",
  "miras-y-opticas": "/categories/miras-y-opticas.jpg",
};

const FALLBACK = "/categories/default.jpg";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Explorar por Categoría</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const img = CATEGORY_IMAGES[cat.slug] ?? FALLBACK;
          return (
            <Link
              key={cat.id}
              href={`/?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden h-40 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-0 right-0 text-center text-white text-sm font-bold px-2 drop-shadow-lg tracking-wide uppercase">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}