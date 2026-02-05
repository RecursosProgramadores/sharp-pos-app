import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { TeamSection } from "@/components/landing/TeamSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { ObjectivesSection } from "@/components/landing/ObjectivesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { ContactSection } from "@/components/landing/ContactSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { ReservationModal } from "@/components/landing/ReservationModal";

export default function LandingPage() {
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const openReservation = () => setIsReservationOpen(true);
  const closeReservation = () => setIsReservationOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onReserveClick={openReservation} />
      <HeroSection onReserveClick={openReservation} />
      <AboutSection />
      <TeamSection />
      <ServicesSection onReserveClick={openReservation} />
      <ObjectivesSection />
      <TestimonialsSection />
      <GallerySection />
      <ContactSection />
      <CTASection onReserveClick={openReservation} />
      <Footer />
      <ReservationModal open={isReservationOpen} onClose={closeReservation} />
    </div>
  );
}
