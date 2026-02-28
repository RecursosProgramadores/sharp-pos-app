import {
  CreditCard,
  Package,
  BarChart3,
  Users,
  UserCircle,
  Building2,
  MessageCircle,
  Cloud,
} from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Cobro rápido",
    description: "Acepta tarjetas, Yape, Plin, efectivo y más. Cobra en segundos y reduce filas.",
    tag: "Popular",
  },
  {
    icon: Package,
    title: "Gestión de inventario",
    description: "Control de stock en tiempo real con alertas de productos bajos y movimientos automáticos.",
  },
  {
    icon: BarChart3,
    title: "Reportes inteligentes",
    description: "Ventas diarias, semanales y mensuales con gráficos claros exportables en PDF y Excel.",
  },
  {
    icon: Users,
    title: "Control de empleados",
    description: "Gestiona horarios, comisiones, incentivos y asistencia de tu equipo fácilmente.",
  },
  {
    icon: UserCircle,
    title: "CRM + Historial",
    description: "Conoce a tus clientes: historial de visitas, preferencias, puntos de lealtad y más.",
  },
  {
    icon: Building2,
    title: "Multi-sucursal",
    description: "Administra múltiples locales desde un solo panel con datos unificados y comparativas.",
    tag: "Próximamente",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Business",
    description: "Envía confirmaciones, recordatorios y promos automáticas directo al WhatsApp de tus clientes.",
  },
  {
    icon: Cloud,
    title: "100% en la nube",
    description: "Sin instalaciones, sin servidores. Accede desde cualquier dispositivo, en cualquier momento.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="funcionalidades"
      className="py-20 lg:py-28 relative"
      style={{ background: "linear-gradient(180deg, #0a0e17 0%, #0f1117 100%)" }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-neon-purple text-sm font-semibold uppercase tracking-widest">
            Funcionalidades
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-3 mb-4">
            Todo lo que necesitas{" "}
            <span className="text-gradient-mixed">para crecer</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Una plataforma completa que se adapta a barberías, cafeterías, tiendas retail y restaurantes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-card-hover p-6 group cursor-default relative"
            >
              {feature.tag && (
                <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  feature.tag === "Popular"
                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                    : "bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                }`}>
                  {feature.tag}
                </span>
              )}
              <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-neon-cyan/10 transition-colors duration-300 border border-white/5">
                <feature.icon className="h-5 w-5 text-white/60 group-hover:text-neon-cyan transition-colors duration-300" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
