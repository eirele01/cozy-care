'use client'

import { useEffect, useState } from 'react'
import { Quote } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { StarRating } from './star-rating'
import { toast } from 'sonner'
import { BUSINESS } from '@/lib/business'

interface TestimonialItem {
  id: string
  name: string
  location: string
  rating: number
  service: string
  quote: string
}

const FALLBACK: TestimonialItem[] = [
  {
    id: 'f1',
    name: 'Marites D.',
    location: 'Quezon City',
    rating: 5,
    service: 'Intensive General Cleaning',
    quote: 'Grabe, sobrang linis! The team arrived on time and my kitchen looked brand new.',
  },
  {
    id: 'f2',
    name: 'Andrea M.',
    location: 'Makati City',
    rating: 5,
    service: 'Carpet Deep Cleaning',
    quote: 'My 8-year-old carpet had coffee stains I thought were permanent. They are GONE.',
  },
]

export function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>(FALLBACK)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setItems(data.testimonials)
        }
      })
      .catch(() => toast.error('Could not load the latest reviews — showing highlights.'))
      .finally(() => !cancelled && setLoaded(true))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="reviews" className="scroll-mt-20 bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client love"
          title={`${BUSINESS.homesServed} cleans — here's what they say`}
          sub="Verified feedback from households and offices across Metro Manila. Follow our socials to see fresh reviews every week."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.07} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <Quote className="h-6 w-6 text-primary/60" aria-hidden />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 border-t pt-4">
                  <StarRating rating={t.rating} />
                  <p className="mt-2 text-sm font-extrabold">{t.name}</p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {t.location} · {t.service}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-xs text-muted-foreground" aria-live="polite">
            {loaded ? 'Loaded from our review archive · ' : ''}
            Sample reviews shown for demo — connect the live Facebook Reviews widget at launch.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
