import { RegisterForm } from "@/components/RegisterForm";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-600 rounded-xl mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Únete a la comunidad de ArmeriaDigital</p>
        </div>
        <div className="card p-8">
          <RegisterForm />
          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">Entra aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
