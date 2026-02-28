import { Clock, Package, BarChart3, UserCheck, ArrowRight } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    problem: "Ventas lentas y filas",
    solution: "Cobros en segundos con lector QR, Yape/Plin y tarjetas",
    color: "from-neon-cyan/20 to-neon-cyan/5",
    borderColor: "hover:border-neon-cyan/30",
  },
  {
    icon: Package,
    problem: "Inventario descontrolado",
    solution: "Control en tiempo real desde el celular con alertas automáticas",
    color: "from-neon-purple/20 to-neon-purple/5",
    borderColor: "hover:border-neon-purple/30",
  },
  {
    icon: BarChart3,
    problem: "Reportes complicados",
    solution: "Gráficos claros y exportables en 1 clic, desde cualquier lugar",
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "hover:border-blue-500/30",
  },
  {
    icon: UserCheck,
    problem: "Clientes que no regresan",
    solution: "Programa de puntos y notificaciones automáticas por WhatsApp",
    color: "from-green-500/20 to-green-500/5",
    borderColor: "hover:border-green-500/30",
  },
];

export function ProblemsSection() {
  return (
    <section className="py-20 lg:py-28 relative" style={{ background: "#0f1117" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-neon-cyan text-sm font-semibold uppercase tracking-widest">
            Problemas → Soluciones
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-3 mb-4">
            Tu negocio merece{" "}
            <span className="text-gradient-cyan">herramientas modernas</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Dejá atrás los cuadernos, las hojas de Excel y los cierres de caja a mano.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((item, i) => (
            <div
              key={i}
              className={`glass-card-hover p-6 group cursor-default`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 border border-white/5`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-white/30 text-xs uppercase tracking-wider line-through mb-2">
                {item.problem}
              </p>
              <p className="text-white font-semibold text-base leading-snug group-hover:text-neon-cyan transition-colors duration-300">
                {item.solution}
              </p>
              <ArrowRight className="h-4 w-4 text-white/10 mt-4 group-hover:text-neon-cyan/50 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
