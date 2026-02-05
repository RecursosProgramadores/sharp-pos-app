import { Award, Users, Zap, Heart } from "lucide-react";

export function AboutSection() {
  const values = [
    {
      icon: Award,
      title: "Calidad",
      description: "Productos y técnicas de última generación para resultados excepcionales.",
    },
    {
      icon: Users,
      title: "Profesionalismo",
      description: "Equipo capacitado y experimentado que brinda un servicio excepcional.",
    },
    {
      icon: Zap,
      title: "Innovación",
      description: "Siempre buscando nuevas formas de mejorar nuestros servicios.",
    },
    {
      icon: Heart,
      title: "Atención Personalizada",
      description: "Servicio atento y personalizado para cada uno de nuestros clientes.",
    },
  ];

  return (
    <section id="nosotros" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-[0.2em] uppercase text-sm">
            Nuestra Esencia
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">
            Quiénes Somos
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          <div className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-display text-2xl text-primary mb-3">Misión</h3>
              <p className="text-muted-foreground">
                Somos una empresa que se preocupa por que los clientes disfruten de nuestro trabajo mediante la innovación, desarrollo y mejora continua de su imagen. En nuestro salón contará con servicios de peluquería, estética y barbería, diferenciándonos por el trato especial con el que atendemos a nuestros clientes y por nuestro trabajo profesional con productos y tecnología de excelente calidad.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-display text-2xl text-primary mb-3">Visión</h3>
              <p className="text-muted-foreground">
                Ser el lugar más atractivo por nuestro esmero y servicio que ofrecemos a quienes nos visitan permanentemente, atender con el mejor esmero y calidad logrando diariamente mantener la frescura de la belleza y la confianza de nuestros clientes como referentes en el cuidado de la imagen personal.
              </p>
            </div>
          </div>
        </div>

        <h3 className="font-display text-2xl text-center mb-8">Nuestros Valores</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={index}
              className="card-elevated p-6 text-center hover:shadow-glow transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <value.icon className="h-7 w-7" />
              </div>
              <h4 className="font-display text-xl mb-2">{value.title}</h4>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
