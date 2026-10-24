import { getUserProfile } from "@/app/auth/actions";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import InteractivePlayground from "@/components/landing/InteractivePlayground";
import ThreeAnglesFramework from "@/components/landing/ThreeAnglesFramework";
import FeatureGrid from "@/components/landing/FeatureGrid";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import LandingFooter from "@/components/landing/LandingFooter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getUserProfile();

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--canvas)] text-[var(--ink-primary)]">
      <LandingNav user={user} />
      <main>
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
