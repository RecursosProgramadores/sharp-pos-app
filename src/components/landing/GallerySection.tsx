import { useState } from "react";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=600&fit=crop",
    category: "Cortes",
    title: "Fade Clásico Perfecto",
  },
  {
    url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop",
    category: "Barba",
    title: "Perfilado de Barba",
  },
  {
    url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=600&fit=crop",
    category: "Proceso",
    title: "Técnica de Degradado",
  },
  {
    url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=600&fit=crop",
    category: "Cortes",
    title: "Corte Texturizado",
  },
  {
    url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop",
    category: "Barba",
    title: "Afeitado Premium",
  },
  {
    url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=600&fit=crop",
    category: "Proceso",
    title: "Transformación Completa",
  },
  {
    url: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&h=600&fit=crop",
    category: "Cortes",
    title: "Estilo Moderno",
  },
  {
    url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&h=600&fit=crop",
    category: "Proceso",
    title: "Detalle y Precisión",
  },
];

const categories = ["Todos", "Cortes", "Barba", "Proceso"];

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredImages =
    activeCategory === "Todos"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <section id="galeria" className="py-20 bg-sidebar text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-[0.2em] uppercase text-sm">
            Nuestro Trabajo
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">
            GALERÍA DE EXCELENCIA
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Cada corte cuenta una historia. Explora nuestro portafolio y descubre el nivel de detalle y precisión que ponemos en cada trabajo.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-primary text-xs font-semibold uppercase">
                    {image.category}
                  </span>
                  <h4 className="font-display text-lg">{image.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { value: "500+", label: "Fotos Publicadas" },
            { value: "50+", label: "Videos de Proceso" },
            { value: "100%", label: "Clientes Satisfechos" },
            { value: "5+", label: "Años de Experiencia" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4">
              <span className="font-display text-3xl md:text-4xl text-primary">
                {stat.value}
              </span>
              <p className="text-white/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
