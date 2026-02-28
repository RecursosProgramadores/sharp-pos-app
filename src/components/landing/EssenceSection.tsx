import { Scissors, Eye, Crown, Heart } from "lucide-react";

const values = [
  {
    icon: Crown,
    title: "Misión",
    text: "Ofrecer la experiencia de barbería más profesional y personalizada, donde cada cliente se sienta único y salga con su mejor versión.",
  },
  {
    icon: Eye,
    title: "Visión",
    text: "Ser la barbería referente en calidad, innovación y atención al detalle en cada ciudad donde operamos.",
  },
  {
    icon: Scissors,
    title: "Precisión",
    text: "Cada corte, cada trazo de navaja, cada detalle importa. Nuestros maestros barberos dominan el oficio con años de experiencia.",
  },
  {
    icon: Heart,
    title: "Atención Personalizada",
    text: "Conocemos tus preferencias, tu historial y tu estilo. Con nuestro sistema exclusivo, tu experiencia mejora en cada visita.",
  },
];

export function EssenceSection() {
  return (
    <section className="py-20 lg:py-28 relative" style={{ background: "#0d1018" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">
            Nuestra Esencia
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-3">
            Tradición que{" "}
            <span className="text-gradient-gold">inspira confianza</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((item, i) => (
            <div key={i} className="glass-card-hover p-6 group">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 border border-gold/10 group-hover:bg-gold/15 transition-colors">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
