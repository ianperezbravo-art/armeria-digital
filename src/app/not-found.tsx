import Link from "next/link";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
      <div>
        <Shield className="w-16 h-16 text-brand-200 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
        <p className="text-gray-600 mb-6">Este anuncio no existe o fue eliminado.</p>
        <Link href="/" className="btn-primary">Volver al inicio</Link>
      </div>
    </div>
  );
}
