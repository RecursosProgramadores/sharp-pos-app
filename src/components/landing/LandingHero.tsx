import { useState, useEffect, useRef } from "react";
import hero1 from "@/assets/hero/carrousel.png";
import hero2 from "@/assets/hero/carrousel2.png";
import hero3 from "@/assets/hero/carrousel3.png";
import hero4 from "@/assets/hero/carrousel4.png";
import nosotrosImg from "@/assets/nosotros.jpeg";

const HERO_IMAGES = [hero1, hero2, hero3, hero4];

interface LandingHeroProps {
  onReserveClick: () => void;
}

export function LandingHero({ onReserveClick }: LandingHeroProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(0);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safety fallback: Fade out the poster image after 3.5 seconds
    // to ensure the video or background is visible even if onLoad is slow.
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Slideshow interval logic
  useEffect(() => {
    const timer = setInterval(() => {
      setPrevImageIndex(currentImageIndex);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentImageIndex]);

  // High-performance parallax scroll logic for desktop
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (window.innerWidth < 768) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (parallaxContainerRef.current) {
            const scrolled = window.scrollY;
            // Shift down slightly to create parallax, with scale to avoid gaps
            parallaxContainerRef.current.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0) scale(1.15)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial position set
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Desktop Background Slideshow with Parallax */}
        <div
          ref={parallaxContainerRef}
          className="hidden md:block absolute inset-0 w-full h-full will-change-transform origin-center z-0"
          style={{ transform: "translate3d(0, 0, 0) scale(1.15)" }}
        >
          {HERO_IMAGES.map((src, index) => {
            const isCurrent = index === currentImageIndex;
            const isPrev = index === prevImageIndex;
            return (
              <img
                key={index}
                src={src}
                alt={`Interior de barbería premium ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out ${
                  isCurrent ? "opacity-100 z-10" : isPrev ? "opacity-100 z-5" : "opacity-0 z-0"
                }`}
                style={{ transitionDuration: "1500ms" }}
                loading={index === 0 ? "eager" : "lazy"}
              />
            );
          })}
        </div>

        {/* Mobile Background */}
        <div className="md:hidden w-full h-full relative overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/R4rkjl4sX64?autoplay=1&mute=1&loop=1&playlist=R4rkjl4sX64&controls=0&showinfo=0&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1"
            className="w-full h-full scale-[1.1] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            allow="autoplay; encrypted-media"
            onLoad={() => setIsVideoLoaded(true)}
            style={{ border: "none" }}
          />
          <img
            src={nosotrosImg}
            alt="El equipo de Tayta Barber"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/40 to-[#050505] z-10 md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-[#050505]/20 to-transparent z-10 md:hidden" />
      </div>

      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
        <div className="absolute top-1/4 left-10 w-[1px] h-40 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent animate-pulse-slow" />
        <div className="absolute top-1/3 right-20 w-[1px] h-56 bg-gradient-to-b from-transparent via-amber-500/20 to-transparent animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-1/4 left-1/4 w-[1px] h-32 bg-gradient-to-b from-transparent via-amber-500/15 to-transparent animate-pulse-slow" style={{ animationDelay: "3s" }} />
        {/* Corner accent lines */}
        <div className="absolute top-32 left-8 w-16 h-[1px] bg-gradient-to-r from-amber-500/40 to-transparent" />
        <div className="absolute top-32 left-8 w-[1px] h-16 bg-gradient-to-b from-amber-500/40 to-transparent" />
      </div>

      <div className="relative z-20 container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="sr-only">Tayta BarberShop | Barbería Premium en Huánuco</h1>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-20" />
    </section>
  );
}
