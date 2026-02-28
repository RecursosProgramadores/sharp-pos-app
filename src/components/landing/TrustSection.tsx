import { useEffect, useRef, useState } from "react";
import { Star, TrendingUp, Store, Coffee, Scissors, ShoppingBag } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-display font-extrabold text-3xl md:text-4xl text-white">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const brands = [
  { icon: Scissors, name: "BarberPro" },
  { icon: Coffee, name: "Café Central" },
  { icon: Store, name: "MiniMarket Express" },
  { icon: ShoppingBag, name: "Boutique Moda" },
  { icon: Scissors, name: "Style Studio" },
  { icon: Coffee, name: "La Esquina" },
];

export function TrustSection() {
  return (
    <section className="py-16 relative" style={{ background: "#0a0e17" }}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { value: 500, suffix: "+", label: "Negocios activos" },
            { value: 125000, suffix: "+", label: "Ventas procesadas" },
            { value: 4.9, suffix: "/5", label: "Calificación promedio" },
            { value: 99.9, suffix: "%", label: "Uptime garantizado" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-white/40 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Brand logos */}
        <div className="text-center mb-8">
          <p className="text-white/30 text-sm uppercase tracking-widest font-medium">
            Negocios que ya venden más con Sharp
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {brands.map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-white/20 hover:text-white/40 transition-colors duration-300"
            >
              <brand.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{brand.name}</span>
            </div>
          ))}
        </div>

        {/* Rating badge */}
        <div className="flex justify-center mt-8">
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white/60 text-sm">4.9 de 5 • 200+ reseñas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
