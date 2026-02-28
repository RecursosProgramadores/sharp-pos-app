const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80",
    alt: "Corte fade profesional",
    label: "Fade Perfecto",
  },
  {
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
    alt: "Afeitado clásico con navaja",
    label: "Afeitado Clásico",
  },
  {
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80",
    alt: "Perfilado de barba profesional",
    label: "Barba Perfilada",
  },
  {
    src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80",
    alt: "Ambiente de barbería premium",
    label: "Nuestro Espacio",
  },
  {
    src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80",
    alt: "Herramientas de barbero profesional",
    label: "Herramientas Pro",
  },
  {
    src: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&q=80",
    alt: "Corte de cabello moderno",
    label: "Estilo Moderno",
  },
];

export function LandingGallery() {
  return (
    <section id="galeria" className="py-20 lg:py-28 relative" style={{ background: "#0a0c12" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-neon-cyan text-sm font-semibold uppercase tracking-[0.2em]">
            Galería
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-3">
            Cada corte cuenta{" "}
            <span className="text-gradient-gold">una historia</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                i === 0 || i === 5 ? "row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover min-h-[200px] group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <span className="text-white font-semibold text-sm">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
