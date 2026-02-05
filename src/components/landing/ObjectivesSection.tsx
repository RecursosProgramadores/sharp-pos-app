import { Scissors, Heart, Sparkles, Users } from "lucide-react";
import { useLocations } from "@/hooks/usePublicData";

export function ObjectivesSection() {
  const { data: locations = [] } = useLocations();

  const stats = [
    { value: locations.length.toString(), label: "Sucursales" },
    { value: "+50", label: "Servicios" },
    { value: "7", label: "Días Abiertos" },
  ];

  const objectives = [
    {
      icon: Scissors,
      title: "Cortes Personalizados",
      description: "Ofrecer cortes de cabello personalizados y de alta calidad que se adapten a las necesidades y preferencias de cada cliente.",
    },
    {
      icon: Heart,
      title: "Servicio Excepcional",
      description: "Proporcionar un servicio al cliente excepcional, que supere las expectativas de quienes nos visitan.",
    },
    {
      icon: Sparkles,
      title: "Innovación Constante",
      description: "Innovar y mejorar constantemente nuestros servicios y productos para mantenernos a la vanguardia.",
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Ser parte activa de la comunidad y contribuir a su crecimiento y desarrollo.",
    },
  ];

  return (
    <section id="beneficios" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-[0.2em] uppercase text-sm">
            Nuestros Objetivos
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">
            Comprometidos con tu imagen
          </h2>
          <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
            Nos distinguimos por nuestra dedicación al detalle, nuestro compromiso con la excelencia y nuestra pasión por hacer que cada cliente salga sintiéndose su mejor versión.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <span className="font-display text-5xl md:text-6xl text-primary">
                {stat.value}
              </span>
              <p className="text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Objectives Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className="card-elevated p-6 text-center hover:shadow-glow transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <objective.icon className="h-7 w-7" />
              </div>
              <h4 className="font-display text-xl mb-2">{objective.title}</h4>
              <p className="text-sm text-muted-foreground">{objective.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
