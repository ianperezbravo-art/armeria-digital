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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  async function handleGoogle() {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setGoogleLoading(false);
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
    <div className="space-y-4">
      {/* Botón Google */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Continuar con Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400">o</span>
        </div>
      </div>

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
    </div>
  );
}