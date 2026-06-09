import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/types";
import { CONDITION_LABELS, CONDITION_COLORS } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { MapPin, Eye } from "lucide-react";

export function ListingCard({ listing }: { listing: Listing }) {
  const mainImage = listing.images?.[0];

  return (
    <Link href={`/listings/${listing.id}`} className="card hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}


            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-8.5-5.5l-2.51 3.01L7 14l-3 4h16l-5.5-7.5z"/>
            </svg>
          </div>
        )}
        {listing.featured && (
         <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full z-10">
          ⭐ Destacado
         </span>
        )}
        {listing.images?.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs rounded-full px-2 py-0.5">
            +{listing.images.length - 1} fotos
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
            {listing.title}
          </h3>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${CONDITION_COLORS[listing.condition]}`}>
            {CONDITION_LABELS[listing.condition]}
          </span>
        </div>

        <p className="text-brand-600 font-bold text-lg mt-2">
          {formatPrice(listing.price)}
        </p>
	   {listing.categories && (
          <p className="text-xs text-gray-500 mt-1">{listing.categories.name}</p>
        )}

        <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {listing.municipio || listing.location}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {listing.views}
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-1">{formatDate(listing.created_at)}</p>
        {listing.profiles?.username && (
          <span
            onClick={(e) => { e.preventDefault(); window.location.href = `/vendedor/${listing.profiles!.username}`; }}
            className="text-xs text-brand-600 hover:underline mt-1 block cursor-pointer"
          >
            @{listing.profiles!.username}
          </span>
        )}
      </div>
    </Link>
  );
}
