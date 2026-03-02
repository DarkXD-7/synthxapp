import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesPreview from "@/components/home/FeaturesPreview";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen animated-bg">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesPreview />
      <CTASection />
      <Footer />
    </main>
  );
}
