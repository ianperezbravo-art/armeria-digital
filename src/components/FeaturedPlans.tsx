"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const PLANS = [
  { days: "7", price: "$5", label: "7 días", description: "Ideal para vender rápido" },
  { days: "15", price: "$10", label: "15 días", description: "Más visibilidad", popular: true },
  { days: "30", price: "$15", label: "30 días", description: "Máxima exposición" },
];

export function FeaturedPlans({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    setLoading(plan);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, plan }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(null);
  };

  return (
    <div className="card p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-bold text-gray-900">Destacar este anuncio</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">Tu anuncio aparecerá primero en el homepage con un badge especial.</p>
      <div className="grid grid-cols-3 gap-3">
        {PLANS.map((plan) => (
          <div key={plan.days} className={`border rounded-xl p-4 text-center relative ${plan.popular ? "border-brand-500 bg-brand-50" : "border-gray-200"}`}>
            {plan.popular && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full">Popular</span>
            )}
            <p className="text-2xl font-extrabold text-gray-900">{plan.price}</p>
            <p className="text-sm font-medium text-gray-700">{plan.label}</p>
            <p className="text-xs text-gray-400 mt-1 mb-3">{plan.description}</p>
            <button
              onClick={() => handleCheckout(plan.days)}
              disabled={loading === plan.days}
              className="btn-primary w-full text-sm py-2"
            >
              {loading === plan.days ? "..." : "Destacar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}