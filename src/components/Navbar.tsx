"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Menu, X, Shield, Plus, User as UserIcon, LogOut, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
           <img src="/logo.png" alt="Calibre" className="h-12 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Inicio
            </Link>
            <Link href="/listings" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Anuncios
            </Link>
            {user ? (
              <>
                <Link href="/listings/new" className="btn-primary text-xs px-3 py-2">
                  <Plus className="w-4 h-4" /> Publicar
                </Link>
                <Link href="/my-listings" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                  Mis Anuncios
                </Link>
                <Link href="/keyword-alerts" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                  <Bell className="w-4 h-4" /> Alertas
                </Link>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                  <UserIcon className="w-4 h-4" /> Mi Perfil
                </Link>
                <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-xs px-3 py-2">
                  Entrar
                </Link>
                <Link href="/register" className="btn-primary text-xs px-3 py-2">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-2">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700">Inicio</Link>
          <Link href="/listings" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700">Anuncios</Link>
          {user ? (
            <>
              <Link href="/listings/new" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-semibold text-brand-600">+ Publicar Anuncio</Link>
              <Link href="/my-listings" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700">Mis Anuncios</Link>
              <Link href="/keyword-alerts" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700 flex items-center gap-1">
                <Bell className="w-4 h-4" /> Alertas
              </Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700">Mi Perfil</Link>
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="block py-2 text-sm text-red-600">Cerrar Sesión</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700">Entrar</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-semibold text-brand-600">Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}