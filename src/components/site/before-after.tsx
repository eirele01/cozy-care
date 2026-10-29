'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { BeforeAfterSlider } from './before-after-slider'
import { TRANSFORMATIONS, type ServiceId } from '@/lib/business'
import { StarRating } from './star-rating'
import { cn } from '@/lib/utils'

const FILTERS: { id: 'all' | ServiceId; label: string }[] = [
  { id: 'all', label: 'All transformations' },
  { id: 'general', label: 'General home' },
  { id: 'post-construction', label: 'Post-construction' },
  { id: 'carpet', label: 'Carpet' },
]

export function BeforeAfterGallery() {
  const [filter, setFilter] = useState<'all' | ServiceId>('all')
  const visible = TRANSFORMATIONS.filter((t) => filter === 'all' || t.category === filter)

  return (
    <section id="results" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Seeing is believing"
          title="Real results. Drag the slider."
          sub="Every transformation below comes from an actual job type we do daily. Drag the handle to reveal the after state."
        />

        {/* Filters */}
        <Reveal className="mb-8 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                'rounded-full border-2 px-4 py-2 text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-ring',
                filter === f.id
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground'
              )}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((t) => (
              <article key={t.id} className="flex flex-col gap-4">
                <BeforeAfterSlider before={t.before} after={t.after} alt={t.title} />
                <div className="flex-1">
                  <span className="inline-block rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
                    {t.categoryLabel}
                  </span>
                  <h3 className="mt-2 text-base font-extrabold tracking-tight">{t.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.story}</p>
                  <figure className="mt-3 flex items-start gap-2 rounded-xl bg-muted/70 p-3">
                    <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <figcaption className="text-[13px] leading-snug text-foreground/80">
                      <StarRating rating={5} className="mb-1" />
                      <span className="block font-semibold">{t.client}</span>
                      <span className="text-muted-foreground">verified client feedback</span>
                    </figcaption>
                  </figure>
                </div>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
