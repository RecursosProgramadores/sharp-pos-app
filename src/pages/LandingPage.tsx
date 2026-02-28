import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { TrustSection } from "@/components/landing/TrustSection";
import { EssenceSection } from "@/components/landing/EssenceSection";
import { LandingServices } from "@/components/landing/LandingServices";
import { LandingTeam } from "@/components/landing/LandingTeam";
import { LandingGallery } from "@/components/landing/LandingGallery";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingContact } from "@/components/landing/LandingContact";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ReservationModal } from "@/components/landing/ReservationModal";

export default function LandingPage() {
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const openReservation = () => setIsReservationOpen(true);
  const closeReservation = () => setIsReservationOpen(false);

  return (
    <div className="min-h-screen" style={{ background: "#0a0c12", color: "#fff" }}>
      <LandingNavbar onReserveClick={openReservation} />
      <LandingHero onReserveClick={openReservation} />
      <TrustSection />
      <EssenceSection />
      <LandingServices onReserveClick={openReservation} />
      <LandingTeam />
      <LandingGallery />
      <LandingTestimonials />
      <LandingContact />
      <FinalCTA onReserveClick={openReservation} />
      <LandingFooter />
      <ReservationModal open={isReservationOpen} onClose={closeReservation} />
    </div>
  );
}
