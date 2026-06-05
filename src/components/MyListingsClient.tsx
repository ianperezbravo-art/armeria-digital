"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";
import { Trash2, CheckCircle, Eye, Pencil, RefreshCw } from "lucide-react";
import { FeaturedPlans } from "@/components/FeaturedPlans";
import Link from "next/link";

export function MyListingsClient({ listings: initial }: { listings: any[] }) {
  const [listings, setListings] = useState(initial);
  const supabase = createClient();

  const markSold = async (id: string) => {
    await supabase.from("listings").update({ status: "sold" }).eq("id", id);
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "sold" } : l))
    );
  };
const relistListing = async (id: string) => {
  const now = new Date().toISOString();
  await supabase.from("listings").update({ 
    created_at: now,
    relisted_at: now,
    status: "active"
  }).eq("id", id);
  setListings((prev) =>
    prev.map((l) => (l.id === id ? { ...l, created_at: now, status: "active" } : l))
  );
};
  const deleteListing = async (id: string) => {
    if (!confirm("¿Seguro que quieres borrar este anuncio?")) return;
    await supabase.from("listings").delete().eq("id", id);
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  if (listings.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-16">
        <p className="text-lg font-medium">No tienes anuncios todavía</p>
        <Link href="/listings/new" className="text-brand-600 hover:underline text-sm mt-2 inline-block">
          Publicar mi primer anuncio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {listings.map((listing) => (
        <div key={listing.id}>
          <div className="card p-4 flex items-center gap-4">
            {listing.images?.[0] && (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-20 h-20 object-cover rounded-lg shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  listing.status === "active" ? "bg-green-100 text-green-700" :
                  listing.status === "sold" ? "bg-gray-100 text-gray-500" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {listing.status === "active" ? "Activo" : listing.status === "sold" ? "Vendido" : "Pendiente"}
                </span>
              </div>
              <p className="text-brand-600 font-bold">{formatPrice(listing.price)}</p>
              <p className="text-xs text-gray-400">{formatDate(listing.created_at)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/listings/${listing.id}`} className="p-2 text-gray-400 hover:text-brand-600">
                <Eye className="w-4 h-4" />
              </Link>
              <Link href={`/listings/${listing.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600" title="Editar">
                <Pencil className="w-4 h-4" />
              </Link>
              {listing.status === "active" && (
                <button onClick={() => markSold(listing.id)} className="p-2 text-gray-400 hover:text-green-600" title="Marcar vendido">
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
         <button onClick={() => relistListing(listing.id)} className="p-2 text-gray-400 hover:text-purple-600" title="Renovar anuncio">
          <RefreshCw className="w-4 h-4" />
         </button>
              <button onClick={() => deleteListing(listing.id)} className="p-2 text-gray-400 hover:text-red-600" title="Borrar">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <FeaturedPlans listingId={listing.id} />
        </div>
      ))}
    </div>
  );
}