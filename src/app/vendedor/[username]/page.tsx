import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/types";
import { User, Star, Package } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function VendedorPage({ params }: { params: { username: string } }) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  if (!profile) notFound();

  const [{ data: listings }, { data: reviews }] = await Promise.all([
    supabase
      .from("listings")
      .select("*, categories(name, slug)")
      .eq("user_id", profile.id)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("*, profiles!reviewer_id(username)")
      .eq("seller_id", profile.id)
      .order("created_at", { ascending: false }),
  ]);

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="card p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
          <User className="w-8 h-8 text-brand-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">@{profile.username}</h1>
          {profile.full_name && <p className="text-gray-600">{profile.full_name}</p>}
          <p className="text-sm text-gray-400 mt-0.5">Miembro desde {formatDate(profile.created_at)}</p>
          {avgRating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
              <span className="text-xs text-gray-400">({reviews?.length} reseñas)</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Anuncios activos", value: listings?.length ?? 0 },
          { label: "Reseñas", value: reviews?.length ?? 0 },
          { label: "Calificación", value: avgRating ? `⭐ ${avgRating}` : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Active listings */}
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-bold text-gray-900">Anuncios Activos</h2>
      </div>
      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(listings as Listing[]).map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Este vendedor no tiene anuncios activos.</p>
      )}

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Reseñas</h2>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">@{(r.profiles as any)?.username}</span>
                  <span className="text-xs text-gray-300 ml-auto">{formatDate(r.created_at)}</span>
                </div>
                {r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}