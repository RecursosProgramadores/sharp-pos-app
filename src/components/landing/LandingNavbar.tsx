import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";

interface LandingNavbarProps {
  onTrialClick: () => void;
}

export function LandingNavbar({ onTrialClick }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#funcionalidades", label: "Funcionalidades" },
    { href: "#precios", label: "Precios" },
    { href: "#testimonios", label: "Testimonios" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-landing-bg/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl lg:text-2xl font-extrabold tracking-tight text-white">
              Sharp<span className="text-gradient-cyan">POS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden sm:inline-flex text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2"
            >
              Iniciar sesión
            </Link>
            <button
              onClick={onTrialClick}
              className="hidden sm:inline-flex btn-neon text-sm font-semibold text-primary-foreground px-5 py-2.5 rounded-lg"
            >
              Prueba gratis
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden glass-card mt-2 mb-4 p-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/70 hover:text-white transition-colors px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/70 hover:text-white transition-colors px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5"
              >
                Iniciar sesión
              </Link>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onTrialClick(); }}
                className="btn-neon text-sm font-semibold text-primary-foreground px-5 py-3 rounded-lg mt-2"
              >
                Prueba gratis 14 días
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
