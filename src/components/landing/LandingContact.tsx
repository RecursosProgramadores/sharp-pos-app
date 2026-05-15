import { MapPin, Clock, MessageCircle, Phone, CheckCircle, ChevronRight } from "lucide-react";
import { useLocations } from "@/hooks/usePublicData";
import { useBusinessInfo, buildWhatsAppLink } from "@/hooks/useBusinessInfo";
import WhatsAppIcon from "@/assets/whatsapp.svg";

export function LandingContact() {
  const biz = useBusinessInfo();
  const mainPhone = "970772564";
  const defaultMsg = "Hola Tayta BarberShop, deseo información sobre sus servicios.";

  const branch = {
    name: "Sucursal Central",
    address: "Jr. Independencia 1589, Huánuco",
    schedule: "Lun - Sáb: 9:30 AM - 9:00 PM",
    phone: mainPhone,
  };

  const benefits = [
    "Confirmación inmediata por WhatsApp",
    "Historial de cortes y preferencias guardado",
    "Recordatorios automáticos antes de tu cita",
    "Cancelación flexible sin costo",
    "Sin pagos adelantados",
    "Pagos rápidos en barbería o app",
  ];

  return (
    <section id="contacto" className="py-24 lg:py-32 relative bg-[#050505] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            
            {/* Left Column: Contact Card */}
            <div className="lg:w-1/2">
              <div className="mb-10">
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">Encuéntranos</span>
                <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-4 tracking-tighter uppercase italic">
                  Tu Barbería <br />
                  <span className="text-gradient-gold">de Confianza</span>
                </h2>
              </div>

              <div className="glass-card p-10 border-white/5 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] relative group hover:border-amber-500/20 transition-all duration-700">
                <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <MapPin className="w-20 h-20 text-amber-500" />
                </div>
                
                <h3 className="text-2xl font-black text-white mb-8 tracking-tight">{branch.name}</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <MapPin className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Ubicación</p>
                      <p className="text-white font-bold leading-relaxed">{branch.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Horario de Atención</p>
                      <p className="text-white font-bold leading-relaxed">{branch.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <Phone className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Teléfono</p>
                      <p className="text-white font-black text-xl tracking-widest leading-relaxed">{branch.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <a
                    href={buildWhatsAppLink(branch.phone, defaultMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#22c35e] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-green-500/10"
                  >
                    <img src={WhatsAppIcon} className="h-5 w-5 invert brightness-0" alt="WhatsApp" style={{ filter: 'brightness(0) invert(1)' }} />
                    Chatear por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Why us? */}
            <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="glass-card p-10 border-white/5 bg-white/[0.02] backdrop-blur-md rounded-[2.5rem] h-full flex flex-col justify-center">
                <h3 className="text-white font-black text-2xl mb-10 tracking-tight flex items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-amber-500" />
                  ¿Por qué reservar con nosotros?
                </h3>
                
                <div className="grid gap-6">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all group-hover:scale-150" />
                      <span className="text-zinc-400 font-medium group-hover:text-white transition-colors">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-zinc-500 text-sm italic mb-6 leading-relaxed">
                    "En Tayta BarberShop no solo cortamos el cabello, esculpimos tu identidad con maestría y tradición."
                  </p>
                  <a
                    href={buildWhatsAppLink(mainPhone, "Hola, quisiera contactarme con el staff.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:gap-5 transition-all"
                  >
                    Contáctanos Staff <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
