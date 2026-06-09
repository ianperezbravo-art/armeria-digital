"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export function AgeVerification() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const val = localStorage.getItem("calibre_age_accepted");
    if (!val) setAccepted(false);
  }, []);

  function handleAccept() {
    localStorage.setItem("calibre_age_accepted", Date.now().toString());
    setAccepted(true);
  }

  if (accepted) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 border-b border-gray-200">
        <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">¡ATENCIÓN!</p>
        <h1 className="text-2xl font-bold text-gray-900">Términos y Condiciones de Uso</h1>
        <p className="text-sm text-gray-500 mt-1">ElCalibre.com — Portal de Clasificados de Armas de Puerto Rico</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 text-sm text-gray-700 leading-relaxed">
        <p><strong>ATENCIÓN:</strong> Cumpla siempre con las leyes estatales, federales e internacionales aplicables.</p>

        <p>Al entrar a ElCalibre.com, usted confirma que tiene <strong>21 años de edad o más</strong> y que posee una <strong>Licencia de Armas vigente</strong> expedida por la Policía de Puerto Rico (PPR), conforme a la Ley 168-2019.</p>

        <p><strong>ElCalibre.com NUNCA es parte de las transacciones entre las partes (Comprador/Vendedor).</strong></p>

        <p>Reporte toda venta de armas ilegal a las agencias pertinentes:</p>
        <ul className="list-none space-y-1 pl-0">
          <li>🚔 <strong>Policía de Puerto Rico:</strong> (787) 343-2020</li>
          <li>🏛️ <strong>ATF:</strong> 1-800-ATF-GUNS (1-800-283-4867)</li>
        </ul>

        <p>ElCalibre.com es un portal de clasificados de armas legales, donde entusiastas licenciados publican armas que desean vender. El posible comprador, también poseedor de licencia vigente, puede adquirir el arma de su interés. Una vez ambas partes acuerden la transacción, deben coordinar y oficializar la venta a través de una <strong>Armería con licencia FFL (Federal Firearms License)</strong> registrada ante el ATF.</p>

        <p>Los vendedores publican sus artículos en el portal. Las leyes federales y estatales rigen la venta de armas de fuego. Todas las transacciones deben cumplir con los requisitos del ATF utilizando exclusivamente comerciantes licenciados como agentes de transferencia. Dicho comercio debe poseer licencia vigente emitida por el Bureau of Alcohol, Tobacco, Firearms and Explosives (ATF).</p>

        <p><a href="https://www.atf.gov/firearms/faq" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">🔗 ATF Firearms FAQ</a></p>

        <p><strong>ElCalibre.com no posee ni vende ninguno de los artículos listados en el portal.</strong> En adición, ElCalibre.com no permitirá bajo ninguna circunstancia actividad ilegal en el portal. Dicha práctica será condenada y reportada a las autoridades pertinentes.</p>

        <p>Las armas de fuego están reguladas en Puerto Rico y en algunos casos prohibidas. Puerto Rico requiere licencia vigente expedida por PPR para toda transacción de compra/venta de armas y compra de municiones, además del Background Check del ATF.</p>

        <p><a href="https://www.atf.gov/firearms/atf-form-4473-firearms-transaction-record-revisions" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">🔗 ATF Form 4473</a></p>

        <p><a href="https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/168-2019.pdf" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">🔗 Ley de Armas de Puerto Rico — Ley 168-2019</a></p>

        <p>Todo usuario registrado en ElCalibre.com acepta y es responsable del cumplimiento de todas las reglas y normas del portal, así como de las leyes estatales, federales e internacionales.</p>

        <p className="text-xs text-gray-400">Al presionar "ACEPTO", confirma que ha leído y acepta los <Link href="/terminos" className="underline hover:text-brand-600">Términos y Condiciones</Link> de ElCalibre.com.</p>
      </div>

      {/* Fixed footer button */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <button
          onClick={handleAccept}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-lg text-base tracking-wide transition-colors"
        >
          ACEPTO
        </button>
      </div>
    </div>
  );
}