"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

const MUNICIPIOS = ["Adjuntas","Aguada","Aguadilla","Aguas Buenas","Aibonito","Anasco","Arecibo","Arroyo","Barceloneta","Barranquitas","Bayamon","Cabo Rojo","Caguas","Camuy","Canovanas","Carolina","Catano","Cayey","Ceiba","Ciales","Cidra","Coamo","Comerio","Corozal","Culebra","Dorado","Fajardo","Florida","Guanica","Guayama","Guayanilla","Guaynabo","Gurabo","Hatillo","Hormigueros","Humacao","Isabela","Jayuya","Juana Diaz","Juncos","Lajas","Lares","Las Marias","Las Piedras","Loiza","Luquillo","Manati","Maricao","Maunabo","Mayaguez","Moca","Morovis","Naguabo","Naranjito","Orocovis","Patillas","Penuelas","Ponce","Quebradillas","Rincon","Rio Grande","Sabana Grande","Salinas","San German","San Juan","San Lorenzo","San Sebastian","Santa Isabel","Toa Alta","Toa Baja","Trujillo Alto","Utuado","Vega Alta","Vega Baja","Vieques","Villalba","Yabucoa","Yauco"];

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

interface Props {
  categories: Category[];
  defaultWhatsapp: string;
  userId: string;
}

export function NewListingForm({ categories, defaultWhatsapp, userId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "bueno" as string,
    category_id: "",
    location: "Puerto Rico",
    municipio: "",
    brand: "",
    whatsapp: defaultWhatsapp,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = 8 - imageFiles.length;
    const toAdd = files.slice(0, remaining);
    setImageFiles((prev) => [...prev, ...toAdd]);
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.price || !form.description || !form.whatsapp) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        const ext = file.name.split(".").pop();
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("listings").upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from("listings").getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }

      const { data, error } = await supabase
        .from("listings")
        .insert({
          user_id: userId,
          title: form.title.trim(),
          description: form.description.trim(),
          price: parseFloat(form.price),
          condition: form.condition,
          category_id: form.category_id ? parseInt(form.category_id) : null,
          location: form.location.trim(),
          municipio: form.municipio,
          brand: form.brand || null,
          whatsapp: form.whatsapp.replace(/\D/g, ""),
          images: uploadedUrls,
        })
        .select("id")
        .single();

      if (error) throw error;
      toast.success("Anuncio publicado!");
      router.push(`/listings/${data.id}`);
    } catch (err: any) {
      toast.error(err.message ?? "Error al publicar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Images */}
      <div>
        <label className="label">Fotos ({imageFiles.length}/8)</label>
        <div className="grid grid-cols-4 gap-3">
          {imagePreviews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
              <Image src={src} alt={`Foto ${i + 1}`} fill className="object-cover" sizes="100px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded">Principal</span>
              )}
            </div>
          ))}
          {imageFiles.length < 8 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-400 flex flex-col items-center justify-center text-gray-400 hover:text-brand-500 transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs mt-1">Agregar</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleImages}
        />
        <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP · Max 8 fotos · La primera foto sera la principal</p>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="label">Titulo *</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} className="input" placeholder="Ej: Glock 19 Gen 5, calibre 9mm" maxLength={100} required />
      </div>

      {/* Price & Condition */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="label">Precio (USD) *</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className="input pl-7" placeholder="0.00" required />
          </div>
        </div>
        <div>
          <label htmlFor="condition" className="label">Condicion *</label>
          <select id="condition" name="condition" value={form.condition} onChange={handleChange} className="input">
            <option value="nuevo">Nuevo</option>
            <option value="como_nuevo">Como Nuevo</option>
            <option value="bueno">Bueno</option>
            <option value="aceptable">Aceptable</option>
          </select>
        </div>
      </div>

      {/* Category & Brand */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category_id" className="label">Categoria</label>
          <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange} className="input">
            <option value="">Sin Categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="brand" className="label">Marca <span className="text-gray-400 font-normal">(opcional)</span></label>
          <select id="brand" name="brand" value={form.brand} onChange={handleChange} className="input">
            <option value="">Selecciona marca</option>
            {BRANDS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Municipio */}
      <div>
        <label htmlFor="municipio" className="label">Municipio</label>
        <select id="municipio" name="municipio" value={form.municipio} onChange={handleChange} className="input">
          <option value="">Selecciona municipio</option>
          {MUNICIPIOS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="label">Descripcion *</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className="input resize-none"
          placeholder="Describe el articulo con detalle: marca, modelo, calibre, accesorios incluidos, historial, etc."
          required
        />
      </div>

      {/* WhatsApp */}
      <div>
        <label htmlFor="whatsapp" className="label">Numero de WhatsApp *</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+</span>
          <input
            id="whatsapp"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            className="input pl-6"
            placeholder="17871234567"
            required
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Incluye el codigo de pais. Ej: 17871234567 (Puerto Rico)</p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</> : "Publicar Anuncio"}
      </button>
    </form>
  );
}