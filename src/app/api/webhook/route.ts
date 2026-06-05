import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_DAYS: Record<string, number> = {
  "7": 7,
  "15": 15,
  "30": 30,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { listingId, plan } = session.metadata!;
    const days = PLAN_DAYS[plan];
    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + days);

    const supabase = await createClient();
    await supabase
      .from("listings")
      .update({ featured: true, featured_until: featuredUntil.toISOString() })
      .eq("id", listingId);
  }

  return NextResponse.json({ received: true });
}