
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const PLANS: Record<string, { price: number; days: number; name: string }> = {
  "7": { price: 500, days: 7, name: "Featured 7 días" },
  "15": { price: 1000, days: 15, name: "Featured 15 días" },
  "30": { price: 1500, days: 30, name: "Featured 30 días" },
};

export async function POST(req: NextRequest) {
  try {
    const { listingId, plan } = await req.json();
    const selectedPlan = PLANS[plan];

    if (!selectedPlan) {
      return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: selectedPlan.name },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/my-listings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/my-listings`,
      metadata: { listingId, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}