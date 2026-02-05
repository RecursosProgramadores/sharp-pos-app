import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Scissors, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onReserveClick: () => void;
}

export function Navbar({ onReserveClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#nosotros", label: "Nosotros" },
    { href: "#servicios", label: "Servicios" },
    { href: "#equipo", label: "Equipo" },
    { href: "#galeria", label: "Galería" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-sidebar/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl text-primary">
              BARBER
            </span>
            <span className="font-display text-2xl md:text-3xl text-white">
              SHOP
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={onReserveClick}
              className="hidden sm:flex gap-2 bg-primary hover:bg-primary/90"
            >
              <Calendar className="h-4 w-4" />
              Reservar
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-sidebar/95 backdrop-blur-md border-t border-white/10 pb-4">
            <nav className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white transition-colors px-4 py-2 text-sm font-medium uppercase tracking-wider"
                >
                  {link.label}
                </a>
              ))}
              <div className="px-4 pt-2">
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onReserveClick();
                  }}
                  className="w-full gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Reservar Cita
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
