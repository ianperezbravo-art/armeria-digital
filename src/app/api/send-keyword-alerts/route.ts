import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  // Verificar cron secret para seguridad
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Obtener listings de las últimas 24 horas
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: newListings } = await supabase
    .from("listings")
    .select("id, title, price, municipio, images, category_id")
    .gte("created_at", since)
    .eq("status", "active");

  if (!newListings || newListings.length === 0) {
    return NextResponse.json({ message: "No new listings" });
  }

  // Obtener todos los keywords con email del usuario
  const { data: alerts } = await supabase
    .from("keyword_alerts")
    .select("user_id, keyword, profiles(email, full_name)");

  if (!alerts || alerts.length === 0) {
    return NextResponse.json({ message: "No alerts configured" });
  }

  // Agrupar keywords por usuario
  const userAlerts: Record<string, { email: string; name: string; keywords: string[] }> = {};
  for (const alert of alerts) {
    const profile = alert.profiles as any;
    if (!profile?.email) continue;
    if (!userAlerts[alert.user_id]) {
      userAlerts[alert.user_id] = {
        email: profile.email,
        name: profile.full_name || "Usuario",
        keywords: [],
      };
    }
    userAlerts[alert.user_id].keywords.push(alert.keyword.toLowerCase());
  }

  // Para cada usuario, buscar matches y mandar email
  let emailsSent = 0;
  for (const [, user] of Object.entries(userAlerts)) {
    const matches = newListings.filter((listing) =>
      user.keywords.some((kw) => listing.title.toLowerCase().includes(kw))
    );

    if (matches.length === 0) continue;

    const listingsHtml = matches.map((l) => `
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;">
        <h3 style="margin:0 0 4px;font-size:16px;">${l.title}</h3>
        <p style="margin:0;color:#dc2626;font-weight:bold;">$${l.price.toLocaleString()}</p>
        <p style="margin:4px 0 8px;color:#6b7280;font-size:14px;">${l.municipio}</p>
        <a href="https://armeria-digital.vercel.app/listings/${l.id}" 
           style="background:#dc2626;color:white;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:14px;">
          Ver anuncio
        </a>
      </div>
    `).join("");

    await resend.emails.send({
      from: "Calibre <alerts@calibrepr.com>",
      to: user.email,
      subject: `${matches.length} anuncio${matches.length > 1 ? "s" : ""} nuevo${matches.length > 1 ? "s" : ""} que te interesan`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h1 style="color:#dc2626;margin-bottom:4px;">Calibre</h1>
          <p style="color:#6b7280;margin-bottom:24px;">Hola ${user.name}, encontramos anuncios nuevos que coinciden con tus alertas.</p>
          ${listingsHtml}
          <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
            Tus alertas activas: ${user.keywords.join(", ")}<br/>
            <a href="https://armeria-digital.vercel.app/profile" style="color:#dc2626;">Administrar alertas</a>
          </p>
        </div>
      `,
    });
    emailsSent++;
  }

  return NextResponse.json({ message: `Sent ${emailsSent} emails` });
}