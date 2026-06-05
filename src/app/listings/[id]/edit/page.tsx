import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EditListingForm } from "@/components/EditListingForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: listing } = await supabase
    .from("listings")
    .select("*, categories(name, slug)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!listing) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Anuncio</h1>
      <EditListingForm listing={listing} categories={categories ?? []} />
    </div>
  );
}