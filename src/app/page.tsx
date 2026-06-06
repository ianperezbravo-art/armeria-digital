import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/ListingCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import type { Listing, Category } from "@/types";
import { Plus, TrendingUp, ShieldCheck, MessageCircle } from "lucide-react";
import { MunicipioFilter } from "@/components/MunicipioFilter";
import { CategoryGrid } from "@/components/CategoryGrid";


interface HomeProps {
  searchParams: Promise<{ category?: string; q?: string; condition?: string; municipio?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  let query = supabase
    .from("listings")
    .select("*, profiles(username, whatsapp), categories(name, slug)")
    .eq("status", "active")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(24);

  if (params.category) {
    const cat = (categories as Category[])?.find((c) => c.slug === params.category);
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (params.condition) query = query.eq("condition", params.condition);
  if (params.municipio) query = query.eq("municipio", params.municipio);
  if (params.q) query = query.ilike("title", `%${params.q}%`);

  const { data: listings } = await query;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            El Marketplace de Armas<br className="hidden sm:block" /> de Puerto Rico
          </h1>
          <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
            Compra y vende pistolas, rifles, accesorios y más entre particulares y comerciantes licenciados.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/listings" className="btn-primary bg-white text-brand-700 hover:bg-brand-50 px-8 py-3 text-base">
              Ver Anuncios
            </Link>
            <Link href="/listings/new" className="btn-secondary border-white/30 text-white hover:bg-white/10 bg-transparent ring-white/40 px-8 py-3 text-base">
              <Plus className="w-5 h-5" /> Publicar Gratis
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto text-center">
            {[
              { icon: ShieldCheck, label: "Solo licenciados", value: "100% Legal" },
              { icon: TrendingUp, label: "Publicar anuncios", value: "Gratis" },
              { icon: MessageCircle, label: "Contacto directo", value: "WhatsApp" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <Icon className="w-5 h-5 mx-auto mb-1 text-brand-200" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-brand-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Category Grid */}
      <CategoryGrid categories={(categories as Category[]) ?? []} />

      {/* Filters + Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
  <div className="flex-1">
    <SearchBar initialQuery={params.q} />
  </div>
  <div className="hidden sm:block">
    <MunicipioFilter activeMunicipio={params.municipio} />
  </div>
</div>
<CategoryFilter categories={(categories as Category[]) ?? []} activeSlug={params.category} />
<div className="sm:hidden">
  <MunicipioFilter activeMunicipio={params.municipio} />
</div>

        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
            {(listings as Listing[]).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center text-gray-500">
            <p className="text-lg font-medium">No se encontraron anuncios</p>
            <p className="text-sm mt-1">Intenta cambiar los filtros o{" "}
              <Link href="/listings/new" className="text-brand-600 hover:underline">publica el primero</Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}