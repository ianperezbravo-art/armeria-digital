import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { KeywordAlertsClient } from "@/components/KeywordAlertsClient";

export default async function KeywordAlertsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: keywords } = await supabase
    .from("keyword_alerts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Alertas de keywords</h1>
      <p className="text-gray-500 text-sm mb-8">Recibe un email diario cuando se publiquen anuncios que coincidan con tus palabras clave.</p>
      <KeywordAlertsClient keywords={keywords ?? []} />
    </div>
  );
}