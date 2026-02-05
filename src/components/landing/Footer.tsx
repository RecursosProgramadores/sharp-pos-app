import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sidebar text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="font-display text-2xl text-primary">BARBER</span>
              <span className="font-display text-2xl text-white">SHOP</span>
            </Link>
            <p className="text-white/60 text-sm max-w-md">
              El arte de la barbería clásica. Tradición, precisión y estilo en cada servicio.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="text-white/60 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/51987457832"
                className="text-white/60 hover:text-success transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4">Enlaces</h4>
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
            <h4 className="font-display text-lg mb-4">Acceso</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/admin"
                  className="text-white/60 hover:text-primary transition-colors"
                >
                  Panel de Administración
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/40">
          <p>© {currentYear} BarberShop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
