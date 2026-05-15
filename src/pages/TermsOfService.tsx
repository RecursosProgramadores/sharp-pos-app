import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
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
            Términos de Servicio
          </h1>
          <p className="text-zinc-500 mb-12 italic">Última actualización: 14 de Mayo, 2026</p>

          <div className="space-y-12 text-zinc-400 leading-relaxed font-light">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">1. Aceptación de Términos</h2>
              <p>
                Al acceder y utilizar los servicios de TAYTA BARBERSHOP, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, le solicitamos no utilizar nuestros servicios.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">2. Reservas y Citas</h2>
              <p>
                Para garantizar la mejor experiencia, establecemos las siguientes reglas para las citas:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-amber-500">
                <li>Las citas deben reservarse con al menos 2 horas de antelación.</li>
                <li>Se solicita puntualidad. Una demora mayor a 15 minutos puede resultar en la cancelación de la cita.</li>
                <li>Las cancelaciones deben realizarse con un mínimo de 4 horas de anticipación.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">3. Precios y Pagos</h2>
              <p>
                Todos los precios de nuestros servicios están sujetos a cambios sin previo aviso. Los pagos se realizarán al finalizar el servicio en el establecimiento o mediante los métodos de pago habilitados en nuestra plataforma.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">4. Conducta del Cliente</h2>
              <p>
                Nos reservamos el derecho de admisión y permanencia. Mantener un ambiente de respeto mutuo es fundamental para nuestra comunidad. No se tolerará ningún tipo de comportamiento abusivo o discriminatorio hacia nuestro personal o otros clientes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">5. Limitación de Responsabilidad</h2>
              <p>
                TAYTA BARBERSHOP no se hace responsable por la pérdida de objetos personales dentro del establecimiento. Asimismo, no nos hacemos responsables por reacciones alérgicas si el cliente no informó previamente sobre sensibilidades a productos específicos.
              </p>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
