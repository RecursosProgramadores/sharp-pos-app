import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Scissors, Calendar } from "lucide-react";

interface LandingNavbarProps {
  onReserveClick: () => void;
}

export function LandingNavbar({ onReserveClick }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#servicios", label: "Servicios" },
    { href: "#equipo", label: "Equipo" },
    { href: "#galeria", label: "Galería" },
    { href: "#testimonios", label: "Testimonios" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0a0c12]/95 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <Scissors className="h-6 w-6 text-gold" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg lg:text-xl font-extrabold tracking-tight text-white">
                BARBER<span className="text-gradient-gold">SHOP</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-medium">
                Barbería Premium
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/50 hover:text-gold transition-colors duration-300 text-sm font-medium tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={onReserveClick}
              className="hidden sm:flex btn-gold text-sm font-bold px-5 py-2.5 rounded-lg items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Reservar
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card mt-2 mb-4 p-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/60 hover:text-gold transition-colors px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { setIsMobileMenuOpen(false); onReserveClick(); }}
                className="btn-gold text-sm font-bold px-5 py-3 rounded-lg mt-2 flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Reservar Cita
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
