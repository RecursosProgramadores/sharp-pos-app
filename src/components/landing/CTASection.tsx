import { Calendar, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onReserveClick: () => void;
}

export function CTASection({ onReserveClick }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-sidebar via-sidebar to-primary/20 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <span className="text-primary font-semibold tracking-[0.2em] uppercase text-sm">
            Reservas Abiertas
          </span>
          <h2 className="font-display text-4xl md:text-6xl mt-2 mb-4">
            ¿Listo para tu próximo
            <br />
            <span className="text-primary">look profesional?</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Reserva tu cita ahora y experimenta el nivel de servicio que mereces.
            Nuestro equipo está preparado para atenderte.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onReserveClick}
              className="gap-2 text-lg bg-primary hover:bg-primary/90 shadow-glow"
            >
              <Calendar className="h-5 w-5" />
              Reservar Ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-lg border-white/30 text-white hover:bg-white/10"
              onClick={() => window.open("https://wa.me/51970772564", "_blank")}
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Confirmación inmediata
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Cancelación flexible
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Sin pagos adelantados
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
