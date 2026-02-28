import { useNavigate } from "react-router-dom";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { TrustSection } from "@/components/landing/TrustSection";
import { ProblemsSection } from "@/components/landing/ProblemsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { PricingSection } from "@/components/landing/PricingSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleTrialClick = () => navigate("/auth");

  return (
    <div className="min-h-screen" style={{ background: "#0a0e17", color: "#fff" }}>
      <LandingNavbar onTrialClick={handleTrialClick} />
      <LandingHero onTrialClick={handleTrialClick} />
      <TrustSection />
      <ProblemsSection />
      <FeaturesSection />
      <LandingTestimonials />
      <PricingSection onTrialClick={handleTrialClick} />
      <FinalCTA onTrialClick={handleTrialClick} />
      <LandingFooter />
    </div>
  );
}
