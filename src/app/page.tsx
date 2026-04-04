import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BtcTicker from "@/components/home/BtcTicker";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import PlansPreview from "@/components/home/PlansPreview";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PayoutFeed from "@/components/home/PayoutFeed";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <BtcTicker />
      <HeroSection />
      <StatsSection />
      <PlansPreview />
      <FeaturesSection />
      <PayoutFeed />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
