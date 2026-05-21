import { Link } from "react-router-dom";
import { 
  Instagram, 
  Facebook, 
  MapPin,
  Clock,
  ChevronRight
} from "lucide-react";
import { useBusinessInfo, buildWhatsAppLink } from "@/hooks/useBusinessInfo";
import Logo from "@/assets/logotayta.png";
import WhatsAppIcon from "@/assets/whatsapp.svg";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z" />
    </svg>
  );
}

function WhatsAppSVG({ className }: { className?: string }) {
  return <img src={WhatsAppIcon} className={className} alt="WhatsApp" style={{ filter: 'brightness(0) invert(1)' }} />;
}

export function LandingFooter() {
  const biz = useBusinessInfo();
  const currentYear = new Date().getFullYear();

  const defaultMsg = "Hola, estoy interesado en obtener más información. ¿Podrían ayudarme?";
  const waLink = biz.phone ? buildWhatsAppLink(biz.phone, defaultMsg) : "#";

  const socials = [
    biz.instagram ? { icon: Instagram, href: biz.instagram, label: "Instagram" } : null,
    biz.facebook ? { icon: Facebook, href: biz.facebook, label: "Facebook" } : null,
    biz.tiktok ? { icon: TikTokIcon, href: biz.tiktok, label: "TikTok" } : null,
    biz.phone ? { icon: WhatsAppSVG, href: waLink, label: "WhatsApp" } : null,
  ].filter(Boolean) as { icon: any; href: string; label: string }[];

  return (
    <footer className="bg-[#050505] text-white border-t border-white/5 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>
      
      {/* Top Accent Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Brand Pillar */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <Link to="/" className="inline-block group">
                <div className="flex flex-col">
                  <div className="w-64 mb-4">
                    <img src={Logo} alt="Tayta BarberShop Logo" className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <div className="h-px w-16 bg-amber-500/50" />
                    <p className="text-amber-500 font-display text-sm uppercase tracking-[0.5em] font-semibold italic pr-2 inline-block">
                      {biz.tagline || "Tu estilo, nuestra pasión"}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            
            <p className="text-zinc-500 text-lg leading-relaxed max-w-md font-light">
              Donde la maestría artesanal de la barbería clásica se fusiona con la sofisticación contemporánea. Redefiniendo la experiencia del caballero moderno.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-6">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center transition-all duration-500 hover:border-amber-500/50 hover:bg-amber-500/5 overflow-hidden"
                  aria-label={s.label}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <s.icon className="h-6 w-6 text-zinc-400 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-500" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3 lg:pl-16">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mb-12 font-black border-l-2 border-amber-500 pl-4">Menú</h4>
            <nav>
              <ul className="space-y-6">
                {[
                  { label: "Servicios", href: "#servicios" },
                  { label: "Equipo", href: "#equipo" },
                  { label: "Galería", href: "#galeria" },
                  { label: "Testimonios", href: "#testimonios" },
                  { label: "Contacto", href: "#contacto" },
                  { label: "Staff", href: "#staff" }
                ].map((item) => (
                  <li key={item.label}>
                    <button 
                      onClick={() => {
                        const el = document.querySelector(item.href);
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-zinc-400 hover:text-white transition-all duration-300 flex items-center justify-between group py-1 w-full text-left"
                    >
                      <span className="text-xl font-light tracking-tight group-hover:tracking-widest transition-all duration-500">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-amber-500/0 group-hover:text-amber-500 group-hover:translate-x-2 transition-all duration-500" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4">
            {/* Contact Grid */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Ubicación</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                  {biz.address || "Av. Principal 456, Miraflores, Lima"}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <Clock className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Citas</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                  {biz.phone || "+51 987 457 832"}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-zinc-600 text-[10px] tracking-[0.3em] font-bold uppercase">
              Established 2026
            </p>
            <p className="text-zinc-400 text-sm tracking-tight">
              © {currentYear} <span className="text-white font-black tracking-widest">{biz.name ? biz.name.toUpperCase() : "TAYTA BARBERSHOP"}</span>. Todos los derechos reservados.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-8 md:gap-12 justify-center md:justify-end">
            <Link 
              to="/privacidad" 
              className="text-zinc-500 hover:text-amber-500 transition-all duration-300 text-[11px] uppercase tracking-[0.25em] font-bold relative group/link"
            >
              Privacidad
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-500 group-hover/link:w-full transition-all duration-500" />
            </Link>
            <Link 
              to="/terminos" 
              className="text-zinc-500 hover:text-amber-500 transition-all duration-300 text-[11px] uppercase tracking-[0.25em] font-bold relative group/link"
            >
              Términos
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-500 group-hover/link:w-full transition-all duration-500" />
            </Link>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfy9eBkXohwlpbyXLNo2BgQto_AZPVDnqIMiVcfHVZ4Z5p_dw/viewform?pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 transition-all duration-300 text-[11px] uppercase tracking-[0.25em] font-bold relative group/link"
            >
              Libro de Reclamaciones
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-400 group-hover/link:w-full transition-all duration-500" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

