import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewListingForm } from "@/components/NewListingForm";
import type { Category } from "@/types";

export default async function NewListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectedFrom=/listings/new");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Publicar Anuncio</h1>
      <p className="text-sm text-gray-500 mb-8">Completa los detalles de tu artículo. Los compradores te contactarán por WhatsApp.</p>
      <NewListingForm
        categories={(categories as Category[]) ?? []}
        defaultWhatsapp={profile?.whatsapp ?? ""}
        userId={user.id}
      />
    </div>
  );
}
