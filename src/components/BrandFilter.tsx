"use client";
import { useRouter, useSearchParams } from "next/navigation";

const BRANDS = [
  "Accuracy International","Aero Precision","Agency Arms","Aimpoint","American Tactical",
  "Anderson Manufacturing","Angstadt Arms","Anschütz","Apex Tactical","Archon Firearms",
  "Armalite","Atlas Gunworks","Auto-Ordnance","Barrett","BCM","Bear Creek Arsenal",
  "Benelli","Beretta","Bersa","Black Rain Ordnance","Blaser","Bond Arms","Browning",
  "Burris","Bushmaster","Canik","CBC","Century Arms","Chiappa","Christensen Arms",
  "Cloud Defensive","CMMG","Colt","Crimson Trace","CZ","Daniel Defense","Davinci",
  "Diamondback Firearms","DPMS","EAA","Ed Brown","EOTech","FAMARS","FN Herstal",
  "Franklin Armory","Freedom Ordnance","Franchi","GA Precision","Geissele","Glock",
  "Harrington & Richardson","Heckler & Koch","Henry Repeating Arms","Hi-Point","Holosun",
  "HS Produkt","Howa","IWI","Jacob Grey","Kahr Arms","Kalashnikov","Kel-Tec","Kimber",
  "Knight's Armament","Kriss","LaRue","Lauro Arms","Leupold","Les Baer","LMT",
  "LWRC International","Magpul","Marlin","Mauser","Merkel","Molot","Mossberg",
  "Nightforce","Nighthawk Custom","Noveske","OA Defense","Olympic Arms","Osight",
  "Palmetto State Armory","Patriot Ordnance Factory","Pedersoli","POF-USA",
  "Primary Arms","PSA","Radical Firearms","Remington","Rock Island Armory",
  "Rock River Arms","Ruger","Sabatti","Sako","Sarsılmaz","Savage","SCCY",
  "Seekins Precision","Shadow Systems","Shield Sights","SIG Sauer","Smith & Wesson",
  "Spikes Tactical","Springfield Armory","Staccato","Stag Arms","Standard Manufacturing",
  "Steyr Arms","Streamlight","SureFire","Swampfox","Tanfoglio","Taran Tactical Innovations",
  "Taurus","Tikka","Tisas","Trijicon","TriStar","Uberti","Vortex","Walther","Weatherby",
  "Wilson Combat","Winchester","Windham Weaponry","Zastava Arms","ZEV Technologies"
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