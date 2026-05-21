import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

import img1 from "@/assets/galeria/2.jpeg";
import img2 from "@/assets/galeria/galeria.jpeg";
import img3 from "@/assets/galeria/galeria3.jpeg";
import img4 from "@/assets/galeria/galeria4.jpeg";
import img5 from "@/assets/galeria/galeria5.jpeg";
import img6 from "@/assets/galeria/galeria6.jpeg";
import img7 from "@/assets/galeria/galeria7.jpeg";
import img8 from "@/assets/galeria/galeria8.jpeg";
import img9 from "@/assets/galeria/galeria9.jpeg";
import img10 from "@/assets/galeria/galeria10.jpeg";
import img11 from "@/assets/galeria/galeria11.jpeg";
import img12 from "@/assets/galeria/galeria12.jpeg";
import img13 from "@/assets/galeria/galeria13.jpeg";
import img14 from "@/assets/galeria/galeria14.jpeg";

const galleryImages = [
  { src: img1,  alt: "Estilo Moderno",          label: "Estilo Moderno" },
  { src: img2,  alt: "Corte de Tendencia",      label: "Corte de Tendencia" },
  { src: img3,  alt: "Fade Perfecto",           label: "Fade Perfecto" },
  { src: img4,  alt: "Barba de Autor",          label: "Barba de Autor" },
  { src: img5,  alt: "Afeitado Clásico",        label: "Afeitado Clásico" },
  { src: img6,  alt: "Corte Urbano",            label: "Corte Urbano" },
  { src: img7,  alt: "Hair Tattoo Precision",   label: "Hair Tattoo Precision" },
  { src: img8,  alt: "Acabado Profesional",     label: "Acabado Profesional" },
  { src: img9,  alt: "Clásico Renovado",        label: "Clásico Renovado" },
  { src: img10, alt: "Detalles de Maestría",    label: "Detalles de Maestría" },
  { src: img11, alt: "Pompadour Fade",          label: "Pompadour Fade" },
  { src: img12, alt: "Barba Clásica",           label: "Barba Clásica" },
  { src: img13, alt: "Estilo & Clase",          label: "Estilo & Clase" },
  { src: img14, alt: "Acabado Mate",            label: "Acabado Mate" },
];

export function LandingGallery() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Close lightbox on Escape key, navigate with Left/Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex]);

  // Disable scroll when lightbox is open
  useEffect(() => {
    if (activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeImageIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));
  };

  return (
    <section id="galeria" className="py-20 lg:py-32 relative bg-[#050505] overflow-clip">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Header ── */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Galería
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white leading-[0.95] tracking-tighter uppercase italic">
            Cada corte cuenta <br className="hidden sm:block" />
            <span className="text-gradient-gold">una historia</span>
          </h2>
          <div className="w-16 h-[2px] bg-amber-500/30 mx-auto mt-6" />
        </div>

        {/* ── Masonry Grid ── */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setActiveImageIndex(i)}
              className="break-inside-avoid relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/5 bg-white/[0.02] group cursor-pointer shadow-lg hover:border-amber-500/30 hover:shadow-2xl transition-all duration-700 active:scale-[0.98]"
            >
              {/* Image */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-auto block object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 flex items-center justify-center text-amber-500 transform scale-75 group-hover:scale-100 transition-all duration-500">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Premium Lightbox Modal ── */}
      {activeImageIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg animate-fade-in"
          onClick={() => setActiveImageIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 hover:border-amber-500/40 transition-all duration-300 z-50 active:scale-90"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 hover:border-amber-500/40 transition-all duration-300 z-50 active:scale-90"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Navigation Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 hover:border-amber-500/40 transition-all duration-300 z-50 active:scale-90"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image Container */}
          <div className="relative max-w-[92vw] max-h-[82vh] flex flex-col items-center justify-center select-none">
            <img
              src={galleryImages[activeImageIndex].src}
              alt={galleryImages[activeImageIndex].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
