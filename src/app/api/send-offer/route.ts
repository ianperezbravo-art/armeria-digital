import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId, offerPrice } = await request.json();

  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get listing info
  const { data: listing } = await serviceSupabase
    .from("listings")
    .select("title, price, user_id")
    .eq("id", listingId)
    .single();

  if (!listing || listing.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Get all watchers with their emails
  const { data: watchers } = await serviceSupabase
    .from("watchlist")
    .select("user_id, profiles(email, full_name)")
    .eq("listing_id", listingId);

  if (!watchers || watchers.length === 0) {
    return NextResponse.json({ message: "No watchers" });
  }

  // Send email to each watcher
  for (const watcher of watchers) {
    const profile = watcher.profiles as any;
    if (!profile?.email) continue;

    await resend.emails.send({
      from: "Calibre <alerts@calibrepr.com>",
      to: profile.email,
      subject: `💰 Oferta especial en "${listing.title}"`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h1 style="color:#dc2626;margin-bottom:4px;">Calibre</h1>
          <p style="color:#6b7280;margin-bottom:24px;">Hola ${profile.full_name || ""},</p>
          <p>El vendedor de un artículo en tu watchlist tiene una oferta especial para ti:</p>
          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0;">
            <h3 style="margin:0 0 8px;">${listing.title}</h3>
            <p style="margin:0;color:#6b7280;text-decoration:line-through;">Precio original: $${listing.price.toLocaleString()}</p>
            <p style="margin:4px 0;color:#dc2626;font-size:24px;font-weight:bold;">Oferta: $${offerPrice.toLocaleString()}</p>
          </div>
          <a href="https://armeria-digital.vercel.app/listings/${listingId}"
             style="background:#dc2626;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Ver anuncio
          </a>
        </div>
      `,
    });
  }

  return NextResponse.json({ message: `Offer sent to ${watchers.length} watchers` });
}