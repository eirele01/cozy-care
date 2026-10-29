import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { TrustBar } from '@/components/site/trust-bar'
import { Services } from '@/components/site/services'
import { PricingCalculator } from '@/components/site/pricing-calculator'
import { BeforeAfterGallery } from '@/components/site/before-after'
import { HowItWorks } from '@/components/site/how-it-works'
import { BookingSection } from '@/components/site/booking'
import { ServiceAreas } from '@/components/site/service-areas'
import { Team } from '@/components/site/team'
import { Testimonials } from '@/components/site/testimonials'
import { BlogHub } from '@/components/site/blog-hub'
import { Faq } from '@/components/site/faq'
import { NewsletterCta } from '@/components/site/newsletter-cta'
import { Footer } from '@/components/site/footer'
import { ChatWidget } from '@/components/site/chat-widget'
import { BUSINESS } from '@/lib/business'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HouseCleaningService' as const,
  name: BUSINESS.name,
  telephone: BUSINESS.phone,
  areaServed: [
    'Metro Manila',
    'Antipolo',
    'Rizal',
    'Cavite',
    'Tagaytay',
    'Bulacan',
    'Laguna',
  ],
  priceRange: '₱800 - ₱3,499',
  openingHours: 'Mo-Su 08:00-18:00',
  sameAs: [BUSINESS.facebook, BUSINESS.instagram, BUSINESS.tiktok],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '25000',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <Services />
        <PricingCalculator />
        <BeforeAfterGallery />
        <HowItWorks />
        <BookingSection />
        <ServiceAreas />
        <Team />
        <Testimonials />
        <BlogHub />
        <Faq />
        <NewsletterCta />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
