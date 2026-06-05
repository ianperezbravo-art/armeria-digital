import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Calibre — Mercado de Armas y Accesorios en Puerto Rico",
  description:
    "Compra y vende armas de fuego, accesorios, municiones y equipo táctico en Puerto Rico. El marketplace #1 para la comunidad de tiradores boricuas.",
  keywords: "armas, accesorios, pistolas, rifles, Puerto Rico, marketplace",
  openGraph: {
    title: "Calibre",
    description: "Marketplace de armas y accesorios en Puerto Rico",
    locale: "es_PR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PR">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-900 text-gray-400 text-sm py-10 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Calibre</h3>
              <p className="text-sm leading-relaxed">
                El marketplace de armas y accesorios #1 de Puerto Rico. Compra y vende de forma segura entre particulares y comerciantes licenciados.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Aviso Legal</h4>
              <p className="text-xs leading-relaxed">
                Todas las transacciones deben cumplir con las leyes de Puerto Rico y federales de EE.UU. Es responsabilidad del comprador y vendedor cumplir con los requisitos de licencia y transferencia aplicables.
              </p>
              <a
                href="https://ogp.pr.gov/Documents/ley-168-2019-segun-enmendada.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-gray-300 hover:text-white text-xs font-medium hover:underline"
              >
                ⚖️ Ver Ley de Armas 168 →
              </a>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Contacto</h4>
              <p className="text-sm">info@Calibre.pr</p>
              <p className="mt-4 text-xs">© {new Date().getFullYear()} Calibre. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}