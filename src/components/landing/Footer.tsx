import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sidebar text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="font-display text-3xl text-primary">BARBER</span>
              <span className="font-display text-3xl text-white">SHOP</span>
            </Link>
            <p className="text-white/60 text-sm max-w-md mb-4">
              El arte de la barbería clásica. Tradición, precisión y estilo en cada servicio.
              Donde la excelencia se encuentra con el profesionalismo.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/51987457832"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-success hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#nosotros" className="text-white/60 hover:text-white transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-white/60 hover:text-white transition-colors">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#equipo" className="text-white/60 hover:text-white transition-colors">
                  Equipo
                </a>
              </li>
              <li>
                <a href="#galeria" className="text-white/60 hover:text-white transition-colors">
                  Galería
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-white/60 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Admin Access */}
          <div>
            <h4 className="font-display text-lg mb-4">Acceso Staff</h4>
            <p className="text-white/60 text-sm mb-4">
              ¿Eres parte del equipo? Accede al panel de administración.
            </p>
            <Link to="/admin">
              <Button variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary hover:text-white">
                <ShieldCheck className="h-4 w-4" />
                Panel Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© {currentYear} BarberShop. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
