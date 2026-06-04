import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { ProfileActions } from "@/components/ProfileActions";
import type { Listing } from "@/types";
import { formatDate } from "@/lib/utils";
import { User, Package } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: listings }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("listings")
      .select("*, categories(name, slug)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const active = (listings ?? []).filter((l) => l.status === "active");
  const other = (listings ?? []).filter((l) => l.status !== "active");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="card p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
          <User className="w-8 h-8 text-brand-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900">@{profile?.username}</h1>
          {profile?.full_name && <p className="text-gray-600">{profile.full_name}</p>}
          <p className="text-sm text-gray-400 mt-0.5">Miembro desde {formatDate(profile?.created_at ?? user.created_at)}</p>
          <p className="text-sm text-gray-500 mt-1">WhatsApp: +{profile?.whatsapp}</p>
        </div>
        <ProfileActions />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Anuncios activos", value: active.length },
          { label: "Total publicados", value: listings?.length ?? 0 },
          { label: "Vendidos", value: (listings ?? []).filter(l => l.status === "sold").length },
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
        <h2 className="text-lg font-bold text-gray-900">Mis Anuncios Activos</h2>
      </div>
      {active.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(active as Listing[]).map((l) => (
            <div key={l.id} className="relative">
              <ListingCard listing={l} />
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Activo</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No tienes anuncios activos.</p>
      )}

      {other.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-gray-900 mt-10 mb-4">Otros Anuncios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-60">
            {(other as Listing[]).map((l) => (
              <div key={l.id} className="relative">
                <ListingCard listing={l} />
                <div className="absolute top-2 left-2">
                  <span className={`text-white text-[10px] font-semibold px-2 py-0.5 rounded-full ${l.status === "sold" ? "bg-gray-600" : "bg-yellow-500"}`}>
                    {l.status === "sold" ? "Vendido" : "Pausado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
