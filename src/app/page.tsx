import { getUserProfile } from "@/app/auth/actions";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import SocialTicker from "@/components/landing/SocialTicker";
import ThreeAnglesFramework from "@/components/landing/ThreeAnglesFramework";
import FeatureGrid from "@/components/landing/FeatureGrid";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { WebGLAuroraShader } from "@/components/ui/WebGLAuroraShader";
import { Particles } from "@/components/ui/Particles";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { StudioPreloader } from "@/components/ui/StudioPreloader";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getUserProfile();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06080D] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* 0. Cinematic Scroll-Locking Preloader */}
      <StudioPreloader />

      {/* 1. Real-time Frosted Glass Scroll Progress Indicator */}
      <ScrollProgress />

      {/* 2. Deep Atmospheric WebGL Aurora Shader (GPU 60fps) */}
      <WebGLAuroraShader className="opacity-45 pointer-events-none fixed inset-0" />

      {/* 3. Constellation Micro-Particles */}
      <Particles
        quantity={45}
        color="#00D492"
        className="pointer-events-none fixed inset-0 -z-10"
      />

      {/* 4. Subtle Matrix Dot Grid */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />

      <LandingNav user={user} />
      <main className="relative z-10">
        <HeroSection user={user} />
        <SocialTicker />
        <ThreeAnglesFramework />
        <FeatureGrid />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
}
