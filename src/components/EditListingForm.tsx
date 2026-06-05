"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

export function EditListingForm({ listing, categories }: { listing: any; categories: any[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(listing.title);
  const [price, setPrice] = useState(listing.price);
  const [description, setDescription] = useState(listing.description);
  const [municipio, setMunicipio] = useState(listing.municipio || "");
  const [categoryId, setCategoryId] = useState(listing.category_id);
  const [condition, setCondition] = useState(listing.condition);
  const [images, setImages] = useState<string[]>(listing.images || []);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newImages = [...images];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${listing.user_id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("listings").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("listings").getPublicUrl(path);
        newImages.push(data.publicUrl);
      }
    }
    setImages(newImages);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("listings").update({
      title,
      price: Number(price),
      description,
      municipio,
      category_id: categoryId,
      condition,
      images,
    }).eq("id", listing.id);
    setLoading(false);
    router.push("/my-listings");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="input w-full" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input w-full" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="input w-full">
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Condición</label>
        <select value={condition} onChange={(e) => setCondition(e.target.value)} className="input w-full">
          <option value="nuevo">Nuevo</option>
          <option value="como_nuevo">Como Nuevo</option>
          <option value="bueno">Bueno</option>
          <option value="aceptable">Aceptable</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
        <select value={municipio} onChange={(e) => setMunicipio(e.target.value)} className="input w-full">
          <option value="">Selecciona municipio</option>
          {MUNICIPIOS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input w-full" rows={4} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} className="w-24 h-24 object-cover rounded-lg" />
              <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="text-sm text-gray-500" />
        {uploading && <p className="text-xs text-gray-400 mt-1">Subiendo fotos...</p>}
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? "Guardando..." : "Guardar Cambios"}
      </button>
    </form>
  );
}