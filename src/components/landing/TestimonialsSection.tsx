import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "La mejor barbería de la zona. El nivel de profesionalismo y atención al detalle es excepcional. Siempre salgo con un corte perfecto.",
    name: "Carlos Martínez",
    role: "Cliente habitual",
    initial: "C",
  },
  {
    text: "Ambiente impecable, barberos de primer nivel y productos de alta calidad. No cambiaría esta barbería por ninguna otra.",
    name: "David Rodríguez",
    role: "Cliente desde 2020",
    initial: "D",
  },
  {
    text: "Desde la primera visita quedé impresionado. La puntualidad y el trato profesional marcan la diferencia. Totalmente recomendado.",
    name: "Miguel Sánchez",
    role: "Nuevo cliente",
    initial: "M",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-[0.2em] uppercase text-sm">
            Testimonios
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-elevated p-6 relative"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              <p className="text-muted-foreground italic mb-6 relative z-10">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-xl">
                  {testimonial.initial}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
