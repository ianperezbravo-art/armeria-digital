import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MyListingsClient } from "@/components/MyListingsClient";

export default async function MyListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: listings } = await supabase
    .from("listings")
    .select("*, categories(name, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get watcher counts for all listings
  const listingIds = (listings ?? []).map((l) => l.id);
  const { data: watcherCounts } = listingIds.length > 0
    ? await supabase
        .from("watchlist")
        .select("listing_id")
        .in("listing_id", listingIds)
    : { data: [] };

  const countMap: Record<string, number> = {};
  for (const row of watcherCounts ?? []) {
    countMap[row.listing_id] = (countMap[row.listing_id] ?? 0) + 1;
  }

  const listingsWithWatchers = (listings ?? []).map((l) => ({
    ...l,
    watcher_count: countMap[l.id] ?? 0,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Anuncios</h1>
      <MyListingsClient listings={listingsWithWatchers} />
    </div>
  );
}