"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export function ProfileActions() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex gap-2 shrink-0">
      <Link href="/listings/new" className="btn-primary text-sm">
        <Plus className="w-4 h-4" /> Nuevo anuncio
      </Link>
      <button onClick={handleSignOut} className="btn-secondary text-sm">
        <LogOut className="w-4 h-4" /> Salir
      </button>
    </div>
  );
}
