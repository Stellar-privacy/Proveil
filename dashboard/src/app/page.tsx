import HeroSection from '@/components/HeroSection';
import ProofGrid from '@/components/ProofGrid';
import HowItWorks from '@/components/HowItWorks';
import VerifySection from '@/components/VerifySection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-stellar-black">
      <HeroSection />
      <HowItWorks />
      <ProofGrid />
      <VerifySection />
      <Footer />
    </main>
  );
}
