export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones de Uso</h1>
      <p className="text-sm text-gray-500 mb-10">Última revisión: junio 2026</p>

      <section className="space-y-10 text-gray-700 leading-relaxed">

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Aceptación de los Términos</h2>
          <p>Al acceder o utilizar ElCalibre.com, usted acepta estar sujeto a estos Términos y Condiciones en su totalidad. Si no está de acuerdo con alguno de estos términos, no utilice este portal. El uso continuado del portal constituye aceptación de cualquier modificación futura.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Mayoría de Edad y Elegibilidad</h2>
          <p>Al registrarse y utilizar ElCalibre.com, usted declara y garantiza que:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Tiene 21 años de edad o más (edad mínima para contratar en Puerto Rico conforme al Código Civil).</li>
            <li>Posee una Licencia de Armas vigente expedida por la Policía de Puerto Rico (PPR), según lo requerido por la Ley 168-2019.</li>
            <li>Cumple con todos los requisitos legales aplicables para poseer, comprar y/o vender armas de fuego en Puerto Rico y bajo las leyes federales de los Estados Unidos.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Naturaleza del Portal — Calibre No es Vendedor</h2>
          <p>ElCalibre.com es un portal de clasificados en línea que facilita el contacto entre particulares y comerciantes licenciados interesados en la compra y venta de armas de fuego, accesorios y artículos relacionados en Puerto Rico.</p>
          <p className="mt-2"><strong>Calibre no es parte de ninguna transacción.</strong> ElCalibre.com no compra, vende, posee, transporta ni transfiere armas de fuego ni ningún artículo listado en el portal. Toda transacción es exclusivamente entre el comprador y el vendedor. Calibre no asume responsabilidad alguna por el contenido de los anuncios, la veracidad de la información publicada, ni el resultado de las transacciones entre usuarios.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Requisitos para Transacciones</h2>
          <p>Toda compra y venta de armas de fuego coordinada a través de ElCalibre.com debe:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Realizarse únicamente a través de un comerciante de armas de fuego con licencia federal vigente (FFL) emitida por el ATF.</li>
            <li>Completar el formulario ATF Form 4473 (Firearms Transaction Record) requerido por ley federal.</li>
            <li>Cumplir con el proceso de verificación de antecedentes (Background Check).</li>
            <li>Cumplir con todos los requisitos de la Ley de Armas de Puerto Rico (Ley 168-2019) y sus reglamentos.</li>
          </ul>
          <p className="mt-2">Ninguna transacción de armas de fuego puede realizarse entre particulares sin la intervención de un FFL dealer autorizado.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Responsabilidad del Usuario</h2>
          <p>Todo usuario registrado en ElCalibre.com es exclusiva y totalmente responsable de:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>La veracidad y legalidad del contenido que publica.</li>
            <li>El cumplimiento de todas las leyes aplicables, incluyendo las leyes de Puerto Rico, las leyes federales y cualquier regulación internacional aplicable.</li>
            <li>Verificar que la otra parte en cualquier transacción posea la licencia vigente requerida por ley.</li>
            <li>Cualquier daño, pérdida o responsabilidad legal que surja de sus publicaciones o transacciones.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contenido Prohibido</h2>
          <p>Queda estrictamente prohibido publicar en ElCalibre.com:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Armas de fuego ilegales o modificadas ilegalmente.</li>
            <li>Armas robadas o de procedencia ilícita.</li>
            <li>Artículos cuya venta esté prohibida bajo la Ley 168-2019 o las leyes federales.</li>
            <li>Municiones o accesorios de venta restringida o prohibida.</li>
            <li>Cualquier artículo que promueva actividad criminal o ilegal.</li>
          </ul>
          <p className="mt-2">ElCalibre.com se reserva el derecho de eliminar cualquier anuncio que viole estas normas sin previo aviso.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Reporte de Actividad Ilegal</h2>
          <p>ElCalibre.com condena toda actividad ilegal relacionada con armas de fuego. Si detecta actividad sospechosa repórtela a:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li><strong>Policía de Puerto Rico:</strong> (787) 343-2020</li>
            <li><strong>ATF:</strong> 1-800-ATF-GUNS (1-800-283-4867)</li>
          </ul>
          <p className="mt-2">ElCalibre.com cooperará con las autoridades en toda investigación que lo requiera.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Referencias Legales</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li><a href="https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/168-2019.pdf" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Ley de Armas de Puerto Rico — Ley 168-2019</a></li>
            <li><a href="https://www.atf.gov/firearms/faq" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">ATF Federal Firearms FAQ</a></li>
            <li><a href="https://www.atf.gov/firearms/atf-form-4473-firearms-transaction-record-revisions" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">ATF Form 4473</a></li>
            <li><a href="https://policia.pr.gov" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Policía de Puerto Rico</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitación de Responsabilidad</h2>
          <p>ElCalibre.com, sus fundadores, empleados y afiliados no serán responsables por ningún daño directo, indirecto, incidental o consecuente derivado del uso del portal, incluyendo pérdidas económicas, daños a la propiedad, lesiones personales o responsabilidades legales surgidas de transacciones entre usuarios.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Modificaciones</h2>
          <p>ElCalibre.com se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor al ser publicadas en el portal.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Ley Aplicable</h2>
          <p>Estos Términos y Condiciones se rigen por las leyes del Estado Libre Asociado de Puerto Rico y las leyes federales aplicables de los Estados Unidos de América.</p>
        </div>

      </section>
    </div>
  );
}