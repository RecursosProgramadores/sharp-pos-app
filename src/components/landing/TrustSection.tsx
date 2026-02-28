import { useEffect, useRef, useState } from "react";
import { Star, Clock, MapPin, MessageCircle } from "lucide-react";

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

export function TrustSection() {
  return (
    <section className="py-16 relative" style={{ background: "#0a0c12" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-center text-white/30 text-sm uppercase tracking-widest mb-10 font-medium">
          La barbería preferida de +1,000 clientes satisfechos
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {[
            { value: 1000, suffix: "+", label: "Clientes satisfechos", icon: Star },
            { value: 5, suffix: " años", label: "De excelencia", icon: Clock },
            { value: 2, suffix: "", label: "Sucursales", icon: MapPin },
            { value: 15000, suffix: "+", label: "Cortes realizados", icon: null },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-white/35 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-6 flex-wrap">
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-white/50 text-sm">4.9/5 promedio</span>
          </div>
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2">
            <MessageCircle className="h-4 w-4 text-green-400" />
            <span className="text-white/50 text-sm">WhatsApp &lt; 30 min</span>
          </div>
        </div>
      </div>
    </section>
  );
}
