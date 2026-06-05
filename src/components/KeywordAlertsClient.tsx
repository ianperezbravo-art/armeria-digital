"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Plus, Bell } from "lucide-react";
import toast from "react-hot-toast";

export function KeywordAlertsClient({ keywords: initial }: { keywords: any[] }) {
  const [keywords, setKeywords] = useState(initial);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const addKeyword = async () => {
    const kw = input.trim().toLowerCase();
    if (!kw) return;
    if (keywords.length >= 10) {
      toast.error("Máximo 10 keywords");
      return;
    }
    if (keywords.some((k) => k.keyword === kw)) {
      toast.error("Ya tienes esa keyword");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("keyword_alerts")
      .insert({ keyword: kw })
      .select()
      .single();
    setLoading(false);

    if (error) {
      toast.error("Error al guardar");
    } else {
      setKeywords((prev) => [data, ...prev]);
      setInput("");
      toast.success(`Alerta creada para "${kw}"`);
    }
  };

  const deleteKeyword = async (id: string, kw: string) => {
    await supabase.from("keyword_alerts").delete().eq("id", id);
    setKeywords((prev) => prev.filter((k) => k.id !== id));
    toast.success(`Alerta eliminada`);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="card p-4">
        <label className="label mb-2">Nueva keyword</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            className="input flex-1"
            placeholder="Ej: Glock, AR15, Hellcat..."
            maxLength={30}
          />
          <button
            onClick={addKeyword}
            disabled={loading || !input.trim()}
            className="btn-primary px-4 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Máximo 10 keywords. Recibirás un email diario con anuncios nuevos que las contengan.</p>
      </div>

      {/* Lista */}
      {keywords.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No tienes alertas configuradas todavía</p>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {keywords.map((kw) => (
            <div key={kw.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-600" />
                <span className="font-medium text-gray-800">{kw.keyword}</span>
              </div>
              <button
                onClick={() => deleteKeyword(kw.id, kw.keyword)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}