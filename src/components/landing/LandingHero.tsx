import { useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";

interface LandingHeroProps {
  onTrialClick: () => void;
}

export function LandingHero({ onTrialClick }: LandingHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      el.style.setProperty("--mouse-x", `${x}px`);
      el.style.setProperty("--mouse-y", `${y}px`);
    };
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0a0e17 0%, #0f1117 40%, #0d1025 100%)" }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-neon-cyan/5 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-neon-purple/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-cyan/3 blur-[150px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 text-sm animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-slow" />
              <span className="text-white/70">+500 negocios ya confían en Sharp</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[0.95] tracking-tight mb-6 animate-slide-up">
              El control total de tu negocio
              <br />
              <span className="text-gradient-cyan">en tu bolsillo</span>
            </h1>

            <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Punto de venta rápido, inventario en tiempo real, reportes inteligentes y fidelización de clientes. Perfecto para barberías, cafeterías, tiendas y restaurantes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <button
                onClick={onTrialClick}
                className="btn-neon text-base font-bold text-primary-foreground px-8 py-4 rounded-xl flex items-center justify-center gap-2"
              >
                Prueba GRATIS 14 días
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                className="btn-outline-glow text-base text-white px-8 py-4 rounded-xl flex items-center justify-center gap-2"
                onClick={() => document.getElementById("funcionalidades")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play className="h-4 w-4" />
                Ver demo en vivo
              </button>
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="relative animate-float hidden lg:block">
            <div className="relative" style={{ perspective: "1200px" }}>
              {/* Main laptop mockup */}
              <div
                className="glass-card p-1 rounded-2xl shadow-2xl shadow-neon-cyan/10"
                style={{ transform: "rotateY(-5deg) rotateX(2deg)" }}
              >
                {/* Browser chrome */}
                <div className="bg-white/5 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                  </div>
                  <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-xs text-white/30 text-center">
                    app.sharppos.com
                  </div>
                </div>
                {/* Dashboard content */}
                <div className="bg-gradient-to-br from-[#0f1520] to-[#0a0e17] p-6 rounded-b-xl">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Ventas hoy", value: "S/ 2,450", color: "from-neon-cyan/20 to-neon-cyan/5" },
                      { label: "Transacciones", value: "47", color: "from-neon-purple/20 to-neon-purple/5" },
                      { label: "Ticket promedio", value: "S/ 52", color: "from-green-500/20 to-green-500/5" },
                    ].map((stat) => (
                      <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-lg p-3 border border-white/5`}>
                        <p className="text-white/40 text-[10px] mb-1">{stat.label}</p>
                        <p className="text-white font-bold text-sm">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Chart placeholder */}
                  <div className="bg-white/3 rounded-lg p-4 border border-white/5">
                    <div className="flex items-end gap-1 h-20 justify-around">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                        <div
                          key={i}
                          className="w-full rounded-t bg-gradient-to-t from-neon-cyan/40 to-neon-cyan/10"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating phone mockup */}
              <div
                className="absolute -bottom-8 -left-12 w-36 glass-card p-1 rounded-2xl shadow-xl shadow-neon-purple/10 animate-float"
                style={{ animationDelay: "1s", transform: "rotateY(5deg)" }}
              >
                <div className="bg-gradient-to-br from-[#0f1520] to-[#0a0e17] rounded-xl p-3">
                  <div className="bg-neon-cyan/10 rounded-lg p-2 mb-2 border border-neon-cyan/10">
                    <p className="text-[8px] text-white/40">Nueva venta</p>
                    <p className="text-xs text-white font-bold">S/ 85.00</p>
                  </div>
                  <div className="bg-neon-purple/10 rounded-lg p-2 border border-neon-purple/10">
                    <p className="text-[8px] text-white/40">Stock bajo</p>
                    <p className="text-[9px] text-amber-400">3 productos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-landing-bg to-transparent" />
    </section>
  );
}
