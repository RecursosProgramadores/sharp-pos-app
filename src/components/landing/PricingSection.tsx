import { Check, Zap, Crown, Building2 } from "lucide-react";

interface PricingSectionProps {
  onTrialClick: () => void;
}

const plans = [
  {
    name: "Starter",
    price: "0",
    period: "por siempre",
    description: "Para empezar a vender mejor",
    icon: Zap,
    color: "border-white/10",
    features: [
      "1 punto de venta",
      "Hasta 100 productos",
      "Reportes básicos",
      "1 usuario",
      "Soporte por email",
    ],
    cta: "Empezar gratis",
    ctaStyle: "btn-outline-glow text-white",
  },
  {
    name: "Pro",
    price: "49",
    period: "/mes",
    description: "El más elegido por negocios en crecimiento",
    icon: Crown,
    color: "border-neon-cyan/30",
    badge: "Más popular",
    features: [
      "Puntos de venta ilimitados",
      "Productos ilimitados",
      "Reportes avanzados + exports",
      "Hasta 5 usuarios",
      "CRM + programa de lealtad",
      "Integración WhatsApp",
      "Soporte prioritario 24/7",
    ],
    cta: "Prueba gratis 14 días",
    ctaStyle: "btn-neon text-primary-foreground",
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Para cadenas y franquicias",
    icon: Building2,
    color: "border-neon-purple/30",
    features: [
      "Todo lo de Pro",
      "Multi-sucursal avanzado",
      "Usuarios ilimitados",
      "API personalizada",
      "Onboarding dedicado",
      "SLA garantizado",
    ],
    cta: "Contactar ventas",
    ctaStyle: "btn-outline-glow text-white",
  },
];

export function PricingSection({ onTrialClick }: PricingSectionProps) {
  return (
    <section
      id="precios"
      className="py-20 lg:py-28 relative"
      style={{ background: "linear-gradient(180deg, #0a0e17 0%, #0d1025 100%)" }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-neon-purple text-sm font-semibold uppercase tracking-widest">
            Precios
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-3 mb-4">
            Planes que crecen{" "}
            <span className="text-gradient-purple">contigo</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Comienza gratis y escala a medida que tu negocio crece.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`glass-card p-7 relative group transition-all duration-500 hover:-translate-y-2 border ${plan.color}`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                <plan.icon className="h-5 w-5 text-white/60" />
              </div>
              <h3 className="text-white font-bold text-lg">{plan.name}</h3>
              <p className="text-white/30 text-sm mb-4">{plan.description}</p>
              <div className="mb-6">
                {plan.price === "Personalizado" ? (
                  <span className="font-display text-2xl font-extrabold text-white">{plan.price}</span>
                ) : (
                  <>
                    <span className="text-white/30 text-sm">S/ </span>
                    <span className="font-display text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-white/30 text-sm">{plan.period}</span>
                  </>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-neon-cyan mt-0.5 shrink-0" />
                    <span className="text-white/60">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onTrialClick}
                className={`w-full py-3 rounded-xl text-sm font-semibold ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
