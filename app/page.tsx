import { Header } from '@/components/header'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { HowItWorks } from '@/components/home/how-it-works'
import { CTASection } from '@/components/home/cta-section'
import { Footer } from '@/components/footer'
import { MarketTicker } from '@/components/market-ticker'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarketTicker />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
