"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectedFrom") ?? "/";
  const supabase = createClient();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(form);
    setLoading(false);
    if (error) {
      toast.error("Correo o contraseña incorrectos");
    } else {
      toast.success("¡Bienvenido!");
      router.push(redirectTo);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">Correo electrónico</label>
        <input
          id="email" type="email" autoComplete="email" required
          value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="input" placeholder="tu@correo.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="label">Contraseña</label>
        <div className="relative">
          <input
            id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required
            value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className="input pr-10" placeholder="••••••••"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</> : "Entrar"}
      </button>
    </form>
  );
}
