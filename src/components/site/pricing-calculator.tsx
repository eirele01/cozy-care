'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Ruler, Sparkles, ArrowRight, Info, BedDouble } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { SERVICES, type ServiceId } from '@/lib/business'
import { calculateEstimate, formatPeso } from '@/lib/pricing'
import { useBookingStore, scrollToId } from '@/lib/store'
import { cn } from '@/lib/utils'

const SQM_PRESETS = [
  { label: 'Studio', sqm: 12 },
  { label: 'Condo 1BR', sqm: 24 },
  { label: 'House 2BR', sqm: 45 },
  { label: 'House 4BR', sqm: 90 },
  { label: 'Office', sqm: 130 },
]

export function PricingCalculator() {
  const setPrefill = useBookingStore((s) => s.setPrefill)
  const [serviceId, setServiceId] = useState<ServiceId>('general')
  const [sqm, setSqm] = useState(25)
  const [rooms, setRooms] = useState(1)

  const service = useMemo(() => SERVICES.find((s) => s.id === serviceId)!, [serviceId])
  const isCarpet = serviceId === 'carpet'

  const result = useMemo(
    () => calculateEstimate(serviceId, sqm, rooms),
    [serviceId, sqm, rooms]
  )

  const sizeDescriptor = useMemo(() => {
    if (isCarpet) return `${rooms} room${rooms > 1 ? 's' : ''} / area${rooms >= 4 ? ' — whole home' : ''}`
    if (sqm <= 15) return 'Studio / single room'
    if (sqm <= 30) return 'Small condo (1–2 BR)'
    if (sqm <= 50) return 'Condo / small house (2–3 BR)'
    if (sqm <= 80) return 'Family house (3–4 BR)'
    if (sqm <= 120) return 'Large house / small office'
    return 'Large property — free ocular estimate'
  }, [sqm, rooms, isCarpet])

  const bookThis = () => {
    setPrefill(serviceId, isCarpet ? undefined : sqm)
    scrollToId('booking')
  }

  return (
    <section id="calculator" className="scroll-mt-20 bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Instant quote"
          title="Know the price before you book"
          sub="Two taps: choose your service, set your space size. The estimate updates live — the number we show is the number you plan around."
        />

        <Reveal>
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Controls */}
            <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8 lg:col-span-3">
              {/* Service selection */}
              <fieldset>
                <legend className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                  1. Choose your service
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" role="radiogroup" aria-label="Service type">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      role="radio"
                      aria-checked={serviceId === s.id}
                      onClick={() => setServiceId(s.id)}
                      className={cn(
                        'rounded-xl border-2 px-2.5 py-3 text-[12.5px] font-bold leading-tight transition-all focus-visible:outline-2 focus-visible:outline-ring',
                        serviceId === s.id
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-background text-foreground/70 hover:border-primary/40 hover:text-foreground'
                      )}
                    >
                      {s.name.replace(' Cleaning', '')}
                      <span className="mt-1 block text-[11px] font-semibold text-muted-foreground">
                        from ₱{s.startingPrice.toLocaleString('en-PH')}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Size input */}
              <fieldset className="mt-8">
                <legend className="flex items-center gap-2 text-sm font-bold text-foreground">
                  {isCarpet ? (
                    <BedDouble className="h-4 w-4 text-primary" aria-hidden />
                  ) : (
                    <Ruler className="h-4 w-4 text-primary" aria-hidden />
                  )}
                  2. How big is the space?
                </legend>

                {isCarpet ? (
                  <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Number of carpeted rooms">
                    {[1, 2, 3, 4].map((r) => (
                      <button
                        key={r}
                        role="radio"
                        aria-checked={rooms === r}
                        onClick={() => setRooms(r)}
                        className={cn(
                          'rounded-full border-2 px-4 py-2 text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-ring',
                          rooms === r
                            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                            : 'border-border bg-background hover:border-primary/40'
                        )}
                      >
                        {r === 4 ? '4+ / whole home' : `${r} room${r > 1 ? 's' : ''}`}
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="mt-4 flex items-center justify-between text-sm font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Home className="h-4 w-4" aria-hidden />
                        {sizeDescriptor}
                      </span>
                      <span className="rounded-lg bg-primary/10 px-3 py-1 text-base font-extrabold text-primary">
                        {sqm} sqm
                      </span>
                    </div>
                    <Slider
                      value={[sqm]}
                      onValueChange={(v) => setSqm(v[0])}
                      min={5}
                      max={150}
                      step={5}
                      aria-label="Space size in square meters"
                      className="mt-4 [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:border-primary"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {SQM_PRESETS.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => setSqm(p.sqm)}
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                            sqm === p.sqm
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                          )}
                        >
                          {p.label} · {p.sqm} sqm
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </fieldset>

              {/* included list */}
              <div className="mt-8 rounded-2xl bg-muted/70 p-5">
                <p className="text-sm font-bold">What&apos;s included in {service.name}:</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {service.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-[13px] leading-snug text-foreground/85">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Estimate panel */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-md md:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your instant estimate</p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={result.priceLabel + serviceId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="mt-2 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
                      {result.priceLabel}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <p className="mt-2 text-sm font-semibold text-foreground/80">{service.name}</p>
                <p className="text-[13px] text-muted-foreground">{result.tierNote}</p>

                <div className="my-5 h-px bg-border" role="separator" />

                <ul className="space-y-2.5 text-sm">
                  <li className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Crew & supplies</span>
                    <span className="font-bold">Included</span>
                  </li>
                  <li className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Travel within Metro Manila</span>
                    <span className="font-bold">FREE</span>
                  </li>
                  <li className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Re-booking / reschedule</span>
                    <span className="font-bold">Free (12h notice)</span>
                  </li>
                  <li className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Payment options</span>
                    <span className="font-bold">GCash · Maya · Bank · Cash</span>
                  </li>
                </ul>

                <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-400/15 p-3 text-[12.5px] leading-snug text-foreground/80">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                  Estimates are &ldquo;from&rdquo; prices based on our published rates. The final quote is confirmed
                  after a quick assessment — no surprise add-ons, ever.
                </div>

                <Button onClick={bookThis} className="mt-5 h-12 w-full rounded-full text-[15px] font-bold shadow-sm">
                  Book {service.name.replace(' Cleaning', '')} Cleaning
                  <ArrowRight className="ml-1.5 h-4.5 w-4.5" aria-hidden />
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Takes under a minute · Confirmation via SMS
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
