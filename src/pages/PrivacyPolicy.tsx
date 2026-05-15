import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30">
      <LandingNavbar onReserveClick={() => {}} />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-3xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-500 transition-colors mb-12 group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>

          <h1 className="text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
            Política de Privacidad
          </h1>
          <p className="text-zinc-500 mb-12 italic">Última actualización: 14 de Mayo, 2026</p>

          <div className="space-y-12 text-zinc-400 leading-relaxed font-light">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">1. Introducción</h2>
              <p>
                En TAYTA BARBERSHOP, valoramos su privacidad y estamos comprometidos a proteger sus datos personales. Esta política explica cómo recopilamos, usamos y protegemos la información cuando utiliza nuestros servicios y sitio web.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">2. Información que Recopilamos</h2>
              <p>
                Recopilamos información necesaria para brindar nuestros servicios de barbería, incluyendo:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-amber-500">
                <li>Nombre y apellidos.</li>
                <li>Número de teléfono y correo electrónico.</li>
                <li>Historial de citas y servicios preferidos.</li>
                <li>Información de pago (procesada de forma segura por terceros).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">3. Uso de la Información</h2>
              <p>
                Utilizamos sus datos exclusivamente para:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-amber-500">
                <li>Gestionar y confirmar sus citas.</li>
                <li>Enviar recordatorios y notificaciones de servicio.</li>
                <li>Mejorar nuestra atención y personalizar su experiencia.</li>
                <li>Cumplir con obligaciones legales y contables.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">4. Seguridad de los Datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información contra acceso no autorizado, alteración o pérdida. Su confianza es nuestra prioridad.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">5. Contacto</h2>
              <p>
                Si tiene dudas sobre esta política, puede contactarnos en <span className="text-amber-500">privacidad@taytabarber.com</span> o visitarnos en nuestra sede principal.
              </p>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
