"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";
import { Trash2, CheckCircle, Eye, Pencil, RefreshCw } from "lucide-react";
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
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;
    const lastRelist = listing.relisted_at || listing.created_at;
    const daysSince = (Date.now() - new Date(lastRelist).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 7) {
      const daysLeft = Math.ceil(7 - daysSince);
      alert(`Puedes renovar este anuncio en ${daysLeft} día${daysLeft === 1 ? "" : "s"}.`);
      return;
    }
    const now = new Date().toISOString();
    await supabase.from("listings").update({
      created_at: now,
      relisted_at: now,
      status: "active"
    }).eq("id", id);
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, created_at: now, relisted_at: now, status: "active" } : l))
    );
  };

  const deleteListing = async (id: string) => {
    if (!confirm("¿Seguro que quieres borrar este anuncio?")) return;
    await supabase.from("listings").delete().eq("id", id);
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const handleFeaturedCheckout = async (listingId: string, plan: string) => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, plan }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  const PLANS = [
    { days: "7", price: "$5", label: "7 días", description: "Vende rápido" },
    { days: "15", price: "$10", label: "15 días", description: "Más visibilidad", popular: true },
    { days: "30", price: "$15", label: "30 días", description: "Máxima exposición" },
  ];

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
      {listings.map((listing) => {
        const isFeatured = listing.featured && listing.featured_until && new Date(listing.featured_until) > new Date();
        const featuredDaysLeft = isFeatured ? Math.ceil((new Date(listing.featured_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
        const daysSinceCreated = (Date.now() - new Date(listing.relisted_at || listing.created_at).getTime()) / (1000 * 60 * 60 * 24);
        const showReminder = daysSinceCreated > 15 && listing.status === "active";

        return (
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
                <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    listing.status === "active" ? "bg-green-100 text-green-700" :
                    listing.status === "sold" ? "bg-gray-100 text-gray-500" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {listing.status === "active" ? "Activo" : listing.status === "sold" ? "Vendido" : "Pendiente"}
                  </span>
                  {isFeatured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-0.5 rounded-full font-medium shrink-0">
                      ⭐ {featuredDaysLeft}d
                    </span>
                  )}
                </div>
                <p className="text-brand-600 font-bold mt-1">{formatPrice(listing.price)}</p>
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

            {/* Banner 15 días */}
            {showReminder && (
              <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                <p className="font-medium text-yellow-800">¿Ya vendiste este artículo?</p>
                <p className="text-yellow-700 mt-1">Este anuncio lleva más de 15 días publicado. Márcalo como vendido, renuévalo para aparecer primero, o destácalo para más visibilidad.</p>
                <div className="flex gap-2 mt-2 mb-4">
                  <button onClick={() => relistListing(listing.id)} className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-medium">
                    🔄 Renovar
                  </button>
                  <button onClick={() => markSold(listing.id)} className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full font-medium">
                    ✅ Ya vendí
                  </button>
                </div>
                {!isFeatured && (
                  <>
                    <p className="text-xs font-semibold text-yellow-800 mb-2">⭐ Destaca tu anuncio para más visibilidad:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {PLANS.map((plan) => (
                        <div key={plan.days} className={`border rounded-lg p-2 text-center relative ${plan.popular ? "border-yellow-500 bg-yellow-100" : "border-yellow-200 bg-white"}`}>
                          {plan.popular && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">Popular</span>
                          )}
                          <p className="text-base font-extrabold text-gray-900">{plan.price}</p>
                          <p className="text-xs text-gray-600">{plan.label}</p>
                          <p className="text-xs text-gray-400 mb-1">{plan.description}</p>
                          <button onClick={() => handleFeaturedCheckout(listing.id, plan.days)} className="btn-primary w-full text-xs py-1">
                            Destacar
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Planes para listings sin reminder y no destacados */}
            {!showReminder && listing.status === "active" && !isFeatured && (
              <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <p className="text-xs font-semibold text-gray-700 mb-2">⭐ Destaca tu anuncio para más visibilidad:</p>
                <div className="grid grid-cols-3 gap-2">
                  {PLANS.map((plan) => (
                    <div key={plan.days} className={`border rounded-lg p-2 text-center relative ${plan.popular ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white"}`}>
                      {plan.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full">Popular</span>
                      )}
                      <p className="text-base font-extrabold text-gray-900">{plan.price}</p>
                      <p className="text-xs text-gray-600">{plan.label}</p>
                      <p className="text-xs text-gray-400 mb-1">{plan.description}</p>
                      <button onClick={() => handleFeaturedCheckout(listing.id, plan.days)} className="btn-primary w-full text-xs py-1">
                        Destacar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}