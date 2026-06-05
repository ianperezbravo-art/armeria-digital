"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export function WatchlistButton({ listingId, initialInWatchlist }: { listingId: string; initialInWatchlist: boolean }) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const toggle = async () => {
    setLoading(true);
    if (inWatchlist) {
      await supabase.from("watchlist").delete().eq("listing_id", listingId);
      setInWatchlist(false);
      toast.success("Eliminado de tu watchlist");
    } else {
      await supabase.from("watchlist").insert({ listing_id: listingId });
      setInWatchlist(true);
      toast.success("Agregado a tu watchlist");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 border rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
        inWatchlist
          ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Heart className={`w-4 h-4 ${inWatchlist ? "fill-red-500 text-red-500" : ""}`} />
      {inWatchlist ? "En tu Watchlist" : "Agregar a Watchlist"}
    </button>
  );
}