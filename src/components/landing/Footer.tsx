import { Link } from "react-router-dom";
import { 
  Instagram, 
  Facebook, 
  MessageCircle, 
  ShieldCheck, 
  Scissors,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppIcon from "@/assets/whatsapp.svg";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: () => <img src={WhatsAppIcon} className="h-6 w-6" style={{ filter: 'brightness(0) invert(1)' }} alt="WhatsApp" />, href: "https://wa.me/51970772564", label: "WhatsApp" }
  ];

  return (
    <footer className="bg-[#050505] text-white border-t border-white/5 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>
      
      {/* Top Accent Gradient Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Brand Pillar - Impactful Typography */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <Link to="/" className="inline-block group">
                <div className="flex flex-col">
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-2">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">TAYTA</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700">BARBER</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-900">SHOP</span>
                  </h2>
                  <div className="flex items-center gap-4 mt-8">
                    <div className="h-px w-16 bg-amber-500/50" />
                    <p className="text-amber-500 font-display text-sm uppercase tracking-[0.5em] font-semibold italic">
                      Tu estilo, nuestra pasión
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            
            <p className="text-zinc-500 text-lg leading-relaxed max-w-md font-light">
              Donde la maestría artesanal de la barbería clásica se fusiona con la sofisticación contemporánea. Redefiniendo la experiencia del caballero moderno.
            </p>
            
            {/* Social Icons with Luxury Styling */}
            <div className="flex gap-6">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="group relative w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center transition-all duration-500 hover:border-amber-500/50 hover:bg-amber-500/5 overflow-hidden"
                  aria-label={social.label}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <social.icon className="h-6 w-6 text-zinc-400 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-500" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation - Sophisticated Menu Style */}
          <div className="lg:col-span-3 lg:pl-16">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mb-12 font-black border-l-2 border-amber-500 pl-4">Menú</h4>
            <nav>
              <ul className="space-y-6">
                {[
                  { name: "Servicios", href: "#servicios" },
                  { name: "Equipo", href: "#equipo" },
                  { name: "Galería", href: "#galeria" },
                  { name: "Testimonios", href: "#testimonios" },
                  { name: "Contacto", href: "#contacto" },
                  { name: "Staff", href: "#staff" }
                ].map((item) => (
                  <li key={item.name}>
                    <button 
                      onClick={() => {
                        const el = document.querySelector(item.href);
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-zinc-400 hover:text-white transition-all duration-300 flex items-center justify-between group py-1 w-full text-left"
                    >
                      <span className="text-xl font-light tracking-tight group-hover:tracking-widest transition-all duration-500">{item.name}</span>
                      <ChevronRight className="h-4 w-4 text-amber-500/0 group-hover:text-amber-500 group-hover:translate-x-2 transition-all duration-500" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact & Admin CTA */}
          <div className="lg:col-span-4 space-y-16">
            {/* Contact Grid */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Ubicación</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                  Av. Principal 456, <br />Miraflores, Lima
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <Clock className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Horario</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed font-light">
                  Lun - Sab: 09:00 - 21:00<br />Dom: 10:00 - 18:00
                </p>
              </div>
            </div>

            {/* Premium Admin Card */}
            <div className="relative group p-[1px] rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/40 via-transparent to-white/10 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#0a0a0a] p-8 rounded-3xl backdrop-blur-xl">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    <ShieldCheck className="h-7 w-7 text-amber-500" />
                  </div>
                  <Scissors className="h-10 w-10 text-zinc-800 rotate-45 group-hover:rotate-0 transition-transform duration-700" />
                </div>
                <h4 className="text-2xl font-bold mb-3 tracking-tight">Acceso Staff</h4>
                <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-light">
                  ¿Eres parte del equipo? Accede al panel de control exclusivo para profesionales.
                </p>
                <Link to="/admin">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black h-16 rounded-2xl transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)] group-hover:shadow-[0_25px_50px_-12px_rgba(245,158,11,0.4)]">
                    <span className="flex items-center gap-3 text-base">
                      Panel Administrativo
                      <ExternalLink className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom - Minimalist & High Contrast */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-zinc-600 text-[10px] tracking-[0.3em] font-bold uppercase">
              Established 2026
            </p>
            <p className="text-zinc-400 text-sm tracking-tight">
              © {currentYear} <span className="text-white font-black tracking-widest">TAYTA BARBERSHOP</span>. Todos los derechos reservados.
            </p>
          </div>
          
          <div className="flex gap-16">
            {["Privacidad", "Términos"].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-zinc-500 hover:text-amber-500 transition-all duration-300 text-[11px] uppercase tracking-[0.25em] font-bold relative group/link"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-500 group-hover/link:w-full transition-all duration-500" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


