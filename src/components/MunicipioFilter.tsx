"use client";

import { useRouter, useSearchParams } from "next/navigation";

const MUNICIPIOS = [
  "Adjuntas","Aguada","Aguadilla","Aguas Buenas","Aibonito","Añasco","Arecibo",
  "Arroyo","Barceloneta","Barranquitas","Bayamón","Cabo Rojo","Caguas","Camuy",
  "Canóvanas","Carolina","Cataño","Cayey","Ceiba","Ciales","Cidra","Coamo",
  "Comerío","Corozal","Culebra","Dorado","Fajardo","Florida","Guánica","Guayama",
  "Guayanilla","Guaynabo","Gurabo","Hatillo","Hormigueros","Humacao","Isabela",
  "Jayuya","Juana Díaz","Juncos","Lajas","Lares","Las Marías","Las Piedras",
  "Loíza","Luquillo","Manatí","Maricao","Maunabo","Mayagüez","Moca","Morovis",
  "Naguabo","Naranjito","Orocovis","Patillas","Peñuelas","Ponce","Quebradillas",
  "Rincón","Río Grande","Sabana Grande","Salinas","San Germán","San Juan",
  "San Lorenzo","San Sebastián","Santa Isabel","Toa Alta","Toa Baja","Trujillo Alto",
  "Utuado","Vega Alta","Vega Baja","Vieques","Villalba","Yabucoa","Yauco"
];

interface Props {
  activeMunicipio?: string;
}

export function MunicipioFilter({ activeMunicipio }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("municipio", e.target.value);
    } else {
      params.delete("municipio");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <select
      value={activeMunicipio || ""}
      onChange={handleChange}
      className="mt-3 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <option value="">Todos los municipios</option>
      {MUNICIPIOS.map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  );
}