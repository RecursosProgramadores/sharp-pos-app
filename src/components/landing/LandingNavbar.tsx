import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logotayta.png";

interface LandingNavbarProps {
  onReserveClick: () => void;
}

export function LandingNavbar({ onReserveClick }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 sm:px-12 ${
        isScrolled ? "py-4" : "py-8"
      }`}
    >
      <div 
        className={`container mx-auto transition-all duration-500 rounded-[2rem] ${
          isScrolled 
            ? "bg-[#050505]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 px-8 py-3" 
            : "bg-transparent px-4 py-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="group flex items-center gap-4">
            <div className={`relative transition-all duration-700 ${isScrolled ? 'w-56' : 'w-72'}`}>
              <img 
                src={Logo} 
                alt="Tayta BarberShop Logo" 
                className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  const el = document.querySelector(link.href);
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="relative text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-500 transition-all duration-500 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-5">
            <Button
              onClick={onReserveClick}
              className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-black font-black px-10 h-14 rounded-2xl transition-all duration-500 shadow-lg shadow-amber-500/20 active:scale-95 group/btn"
            >
              <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              RESERVAR
            </Button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-x-6 sm:inset-x-12 transition-all duration-700 ease-in-out ${
          isMobileMenuOpen ? "top-32 opacity-100 translate-y-0" : "top-20 opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        <div className="bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-3xl">
          <nav className="flex flex-col gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.querySelector(link.href);
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-3xl font-light tracking-tighter text-zinc-300 hover:text-amber-500 transition-all flex items-center justify-between group"
              >
                {link.label}
                <ChevronRight className="h-8 w-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-amber-500" />
              </button>
            ))}
            <div className="h-px bg-white/5 my-4" />
            <Button
              onClick={() => { setIsMobileMenuOpen(false); onReserveClick(); }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black h-20 rounded-3xl text-xl shadow-2xl shadow-amber-500/20"
            >
              Reservar Cita Ahora
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
