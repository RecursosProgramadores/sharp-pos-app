import { Link } from "react-router-dom";
import { Scissors, Instagram, Facebook, MessageCircle, ShieldCheck } from "lucide-react";
import { useBusinessInfo, buildWhatsAppLink } from "@/hooks/useBusinessInfo";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z" />
    </svg>
  );
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
    biz.phone ? { icon: MessageCircle, href: waLink, label: "WhatsApp" } : null,
  ].filter(Boolean) as { icon: any; href: string; label: string }[];

  return (
    <footer style={{ background: "#070a10" }} className="text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <Scissors className="h-5 w-5 text-gold" />
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                {biz.name ? biz.name.toUpperCase() : "BARBERSHOP"}
              </span>
            </Link>
            <p className="text-white/25 text-sm max-w-md mb-6 leading-relaxed">
              {biz.tagline || "El arte de la barbería clásica. Tradición, precisión y estilo en cada servicio."}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/25 hover:bg-gold/10 hover:text-gold transition-all duration-300 border border-white/5"
                    aria-label={s.label}
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/40 mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Servicios", href: "#servicios" },
                { label: "Equipo", href: "#equipo" },
                { label: "Galería", href: "#galeria" },
                { label: "Testimonios", href: "#testimonios" },
                { label: "Contacto", href: "#contacto" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/25 hover:text-gold transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/40 mb-4">Staff</h4>
            <p className="text-white/25 text-sm mb-4">
              ¿Eres parte del equipo? Accede al panel.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-sm text-gold/60 hover:text-gold transition-colors border border-gold/20 hover:border-gold/40 rounded-lg px-4 py-2"
            >
              <ShieldCheck className="h-4 w-4" />
              Panel Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/15">
            <p>© {currentYear} {biz.name || "BarberShop"}. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/30 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white/30 transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
