import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/ListingCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import type { Listing, Category } from "@/types";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ category?: string; q?: string; condition?: string; page?: string }>;
}

const PAGE_SIZE = 20;

export default async function ListingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const supabase = await createClient();

  const { data: categories } = await supabase.from("categories").select("*").order("name");

  let query = supabase
    .from("listings")
    .select("*, profiles(username, whatsapp), categories(name, slug)", { count: "exact" })
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (params.category) {
    const cat = (categories as Category[])?.find((c) => c.slug === params.category);
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (params.condition) query = query.eq("condition", params.condition);
  if (params.q) query = query.ilike("title", `%${params.q}%`);

  const { data: listings, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Anuncios {count !== null && <span className="text-gray-500 text-lg font-normal">({count})</span>}
        </h1>
        <Link href="/listings/new" className="btn-primary">
          + Publicar
        </Link>
      </div>

      <SearchBar initialQuery={params.q} />
      <CategoryFilter categories={(categories as Category[]) ?? []} activeSlug={params.category} />

      {/* Condition filter */}
      <div className="flex gap-2 mt-3 text-sm">
        {[
          { label: "Todos", value: "" },
          { label: "Nuevo", value: "nuevo" },
          { label: "Como Nuevo", value: "como_nuevo" },
          { label: "Bueno", value: "bueno" },
          { label: "Aceptable", value: "aceptable" },
        ].map(({ label, value }) => {
          const active = (params.condition ?? "") === value;
          const newParams = new URLSearchParams();
          if (params.q) newParams.set("q", params.q);
          if (params.category) newParams.set("category", params.category);
          if (value) newParams.set("condition", value);
          return (
            <Link
              key={value}
              href={`/listings?${newParams.toString()}`}
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                active ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {listings && listings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
            {(listings as Listing[]).map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <Link href={`/listings?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`} className="btn-secondary px-4 py-2 text-sm">
                  ← Anterior
                </Link>
              )}
              <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
              {page < totalPages && (
                <Link href={`/listings?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`} className="btn-secondary px-4 py-2 text-sm">
                  Siguiente →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mt-16 text-center text-gray-500">
          <p className="text-lg font-medium">No se encontraron anuncios</p>
          <p className="text-sm mt-1">
            <Link href="/listings/new" className="text-brand-600 hover:underline">Sé el primero en publicar</Link>
          </p>
        </div>
      )}
    </div>
  );
}
