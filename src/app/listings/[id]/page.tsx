import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Listing } from "@/types";
import { CONDITION_LABELS, CONDITION_COLORS } from "@/types";
import { formatPrice, formatDate, buildWhatsAppUrl } from "@/lib/utils";
import { ImageGallery } from "@/components/ImageGallery";
import { MapPin, Eye, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";
import { WatchlistButton } from "@/components/WatchlistButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*, profiles(username, full_name, whatsapp, created_at), categories(name, slug)")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (!listing) notFound();

  supabase.rpc("increment_listing_views", { listing_id: id }).then(() => {});

  const { data: { user } } = await supabase.auth.getUser();

  let inWatchlist = false;
  if (user) {
    const { data: wl } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("listing_id", id)
      .single();
    inWatchlist = !!wl;
  }

  const { count: watcherCount } = await supabase
    .from("watchlist")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", id);

  const l = listing as Listing;
  const waMessage = `Hola, vi tu anuncio en Calibre: "${l.title}" por ${formatPrice(l.price)}. ¿Aún está disponible?`;
  const waUrl = buildWhatsAppUrl(l.whatsapp, waMessage);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-600">Inicio</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-brand-600">Anuncios</Link>
        {l.categories && (
          <>
            <span>/</span>
            <Link href={`/?category=${l.categories.slug}`} className="hover:text-brand-600">
              {l.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{l.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <ImageGallery images={l.images} title={l.title} />
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-xl font-bold text-gray-900 flex-1">{l.title}</h1>
              <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-semibold ${CONDITION_COLORS[l.condition]}`}>
                {CONDITION_LABELS[l.condition]}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-brand-600">{formatPrice(l.price)}</p>

            {l.categories && (
              <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                <Tag className="w-4 h-4" /> {l.categories.name}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {l.municipio || l.location}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {l.views} vistas
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {formatDate(l.created_at)}
              </span>
              {watcherCount && watcherCount > 0 && (
                <span className="flex items-center gap-1">
                  👁 {watcherCount} siguiendo
                </span>
              )}
            </div>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full text-base py-4 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar por WhatsApp
          </a>
href={`sms:+${l.whatsapp}&body=${encodeURIComponent(`Hola, vi tu anuncio en Calibre: "${l.title}" por ${formatPrice(l.price)}. ¿Aún está disponible?`)}`}
            className="w-full text-base py-4 flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
            Enviar Mensaje
          </a>
          {user && user.id !== l.user_id && (
            <WatchlistButton
              listingId={id}
              initialInWatchlist={inWatchlist}
            />
          )}

          {l.profiles && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> Vendedor
              </h3>
              <p className="font-medium text-gray-900">@{l.profiles.username}</p>
              {l.profiles.full_name && (
                <p className="text-sm text-gray-500">{l.profiles.full_name}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Miembro desde {formatDate((l.profiles as any).created_at)}
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800">
            <p className="font-semibold mb-1">Aviso Legal</p>
            <p>Todas las transacciones de armas de fuego deben realizarse conforme a la Ley 168-2019 de Armas de Puerto Rico y las leyes federales aplicables. Se requiere licencia de armas vigente para comprar, vender o transferir armas de fuego.</p>
          </div>
        </div>
      </div>

      <div className="card p-6 mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Descripción</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{l.description}</p>
      </div>
    </div>
  );
}