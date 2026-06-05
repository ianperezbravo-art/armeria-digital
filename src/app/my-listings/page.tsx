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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Anuncios</h1>
      <MyListingsClient listings={listings ?? []} />
    </div>
  );
}