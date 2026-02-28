import { Link } from "react-router-dom";
import { Zap, Instagram, Facebook, MessageCircle, ShieldCheck } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "#080b12" }} className="text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                Sharp<span className="text-gradient-cyan">POS</span>
              </span>
            </Link>
            <p className="text-white/30 text-sm max-w-md mb-6 leading-relaxed">
              El sistema de punto de venta más moderno para negocios en Perú y Latinoamérica. Rápido, inteligente y 100% en la nube.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: MessageCircle, href: "https://wa.me/51987457832", label: "WhatsApp" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all duration-300 border border-white/5"
                  aria-label={s.label}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/50 mb-4">Producto</h4>
            <ul className="space-y-2 text-sm">
              {["Funcionalidades", "Precios", "Testimonios", "Blog"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="text-white/30 hover:text-white transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/50 mb-4">Acceso</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/auth" className="text-white/30 hover:text-white transition-colors">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/30 hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Panel Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/20">
            <p>© {currentYear} Sharp POS. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/40 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white/40 transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
