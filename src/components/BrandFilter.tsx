"use client";
import { useRouter, useSearchParams } from "next/navigation";

const BRANDS = [
  "Glock","Smith & Wesson","Sig Sauer","Springfield Armory","Ruger","Beretta",
  "Taurus","CZ","Walther","Kimber","HK","FN","Canik","Kahr","Kel-Tec",
  "Daniel Defense","BCM","Aero Precision","PSA","Anderson","CMMG",
  "Windham Weaponry","IWI","Kriss","Mossberg","Remington","Benelli",
  "Winchester","Browning","Savage","TriStar","Vortex","Trijicon","Leupold",
  "EOTech","Aimpoint","Holosun","Primary Arms","Swampfox","Burris",
  "Nightforce","Crimson Trace","Osight","Shield Sights","Magpul",
  "Streamlight","SureFire","Cloud Defensive","Geissele","Apex Tactical","LaRue"
];

export function BrandFilter({ activeBrand }: { activeBrand?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) params.set("brand", e.target.value);
    else params.delete("brand");
    router.push(`/?${params.toString()}`);
  };

  return (
    <select
      value={activeBrand || ""}
      onChange={handleChange}
      className="mt-3 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <option value="">Todas las marcas</option>
      {BRANDS.map((b) => (
        <option key={b} value={b}>{b}</option>
      ))}
    </select>
  );
}