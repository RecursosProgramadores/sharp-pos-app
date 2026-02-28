import { MapPin, Clock, MessageCircle, Phone, CheckCircle } from "lucide-react";
import { useLocations } from "@/hooks/usePublicData";

export function LandingContact() {
  const { data: locations } = useLocations();

  const fallbackLocations = [
    {
      name: "Sede Principal",
      address: "Jr. Constitución 235, Huánuco",
      phone: "987 457 832",
      schedule: "Lunes a Sábado: 9:00 AM - 8:00 PM",
      whatsapp: "51987457832",
    },
  ];

  const displayLocations = locations && locations.length > 0 ? locations : fallbackLocations;

  return (
    <section id="contacto" className="py-20 lg:py-28 relative" style={{ background: "#0a0c12" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-neon-cyan text-sm font-semibold uppercase tracking-[0.2em]">
            Contacto
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-3">
            Encuéntranos{" "}
            <span className="text-gradient-gold">fácilmente</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-5">
            {displayLocations.map((loc, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="text-white font-bold text-lg mb-4">{loc.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-white/50 text-sm">{loc.address}</span>
                  </div>
                  {loc.schedule && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                      <span className="text-white/50 text-sm">{loc.schedule}</span>
                    </div>
                  )}
                  {loc.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                      <span className="text-white/50 text-sm">{loc.phone}</span>
                    </div>
                  )}
                </div>
                {loc.whatsapp && (
                  <a
                    href={`https://wa.me/${loc.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-green-600/15 hover:bg-green-600/25 text-green-400 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-green-600/15"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chatear por WhatsApp
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="glass-card p-6 flex flex-col justify-center">
            <h3 className="text-white font-bold text-lg mb-6">¿Por qué reservar con nosotros?</h3>
            <div className="space-y-4">
              {[
                "Confirmación inmediata por WhatsApp",
                "Historial de cortes y preferencias guardado",
                "Recordatorios automáticos antes de tu cita",
                "Cancelación flexible sin costo",
                "Sin pagos adelantados",
                "Pagos rápidos en barbería o app",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-gold shrink-0" />
                  <span className="text-white/50 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
