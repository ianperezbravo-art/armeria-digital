"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    full_name: "",
    whatsapp: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!form.whatsapp.replace(/\D/g, "")) {
      toast.error("Ingresa un número de WhatsApp válido");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username.trim().toLowerCase(),
          full_name: form.full_name.trim(),
          whatsapp: form.whatsapp.replace(/\D/g, ""),
        },
      },
    });
    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("Este correo ya está registrado");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("¡Cuenta creada! Revisa tu correo para confirmar.");
      router.push("/");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="username" className="label">Usuario *</label>
          <input
            id="username" name="username" required autoComplete="username"
            value={form.username} onChange={handleChange}
            className="input" placeholder="tiradorpr"
            pattern="[a-zA-Z0-9_]{3,20}"
            title="3-20 caracteres, letras, números y guión bajo"
          />
        </div>
        <div>
          <label htmlFor="full_name" className="label">Nombre</label>
          <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} className="input" placeholder="Juan Rivera" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="label">Correo electrónico *</label>
        <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} className="input" placeholder="tu@correo.com" />
      </div>

      <div>
        <label htmlFor="password" className="label">Contraseña *</label>
        <div className="relative">
          <input
            id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8}
            value={form.password} onChange={handleChange} className="input pr-10" placeholder="Mínimo 8 caracteres"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="whatsapp" className="label">WhatsApp *</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+</span>
          <input
            id="whatsapp" name="whatsapp" required
            value={form.whatsapp} onChange={handleChange}
            className="input pl-6" placeholder="17871234567"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Con código de país. Ej: 17871234567</p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta...</> : "Crear Cuenta"}
      </button>
    </form>
  );
}
