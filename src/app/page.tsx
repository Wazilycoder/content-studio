import { getUserProfile } from "@/app/auth/actions";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import InteractivePlayground from "@/components/landing/InteractivePlayground";
import ThreeAnglesFramework from "@/components/landing/ThreeAnglesFramework";
import FeatureGrid from "@/components/landing/FeatureGrid";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import LandingFooter from "@/components/landing/LandingFooter";
import FloatingSocialIcons from "@/components/ui/FloatingSocialIcons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getUserProfile();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--canvas)] text-[var(--ink-primary)]">
      <FloatingSocialIcons variant="landing" />
      <LandingNav user={user} />
      <main className="relative z-10">
        <HeroSection user={user} />
        <InteractivePlayground />
        <ThreeAnglesFramework />
        <FeatureGrid />
        <PricingSection />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
}
