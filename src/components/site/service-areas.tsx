'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, CarFront, Clock3, Info } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { AREA_ZONES, type AreaZone } from '@/lib/business'
import { scrollToId } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ZONE_STYLES: Record<string, { fill: string; text: string }> = {
  emerald: { fill: 'fill-emerald-500/25 stroke-emerald-600', text: 'text-emerald-700 dark:text-emerald-400' },
  amber: { fill: 'fill-amber-400/25 stroke-amber-600', text: 'text-amber-700 dark:text-amber-400' },
  teal: { fill: 'fill-teal-400/25 stroke-teal-600', text: 'text-teal-700 dark:text-teal-400' },
  lime: { fill: 'fill-lime-400/25 stroke-lime-600', text: 'text-lime-700 dark:text-lime-400' },
  orange: { fill: 'fill-orange-400/25 stroke-orange-600', text: 'text-orange-700 dark:text-orange-400' },
  rose: { fill: 'fill-rose-400/25 stroke-rose-600', text: 'text-rose-700 dark:text-rose-400' },
}

export function ServiceAreas() {
  const [active, setActive] = useState<AreaZone>(AREA_ZONES[0])

  return (
    <section id="areas" className="scroll-mt-20 bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where we clean"
          title="We come to you — Greater Metro Manila & beyond"
          sub="Free travel anywhere in Metro Manila. Tap a zone to see coverage cities and estimated travel details."
        />

        <div className="grid items-start gap-8 lg:grid-cols-5">
          {/* Schematic map */}
          <Reveal className="lg:col-span-3">
            <div className="rounded-3xl border bg-card p-4 shadow-sm md:p-6">
              <svg
                viewBox="0 0 100 110"
                className="w-full"
                role="img"
                aria-label="Schematic service coverage map: Metro Manila center, Bulacan north, Rizal east, Cavite southwest, Laguna south, Tagaytay far south"
              >
                {/* background */}
                <rect x="2" y="2" width="96" height="106" rx="8" className="fill-muted/50" />

                {/* subtle water hint (Manila Bay, west) */}
                <path d="M10 40 Q14 60 8 78 Q6 88 12 100 L2 100 L2 40 Z" className="fill-teal-400/15" />

                {/* connection lines from hub */}
                {AREA_ZONES.filter((z) => z.id !== 'metro-manila').map((z) => (
                  <line
                    key={z.id}
                    x1={50}
                    y1={52}
                    x2={z.x}
                    y2={z.y}
                    className="stroke-border"
                    strokeWidth="0.7"
                    strokeDasharray="2 2"
                  />
                ))}

                {/* zones */}
                {AREA_ZONES.map((z) => {
                  const isActive = active.id === z.id
                  const style = ZONE_STYLES[z.color] ?? ZONE_STYLES.emerald
                  return (
                    <g
                      key={z.id}
                      onClick={() => setActive(z)}
                      className="cursor-pointer focus-visible:outline-none"
                      role="button"
                      tabIndex={0}
                      aria-pressed={isActive}
                      aria-label={`${z.name} — travel fee ${z.travelFee}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setActive(z)
                        }
                      }}
                    >
                      <ellipse
                        cx={z.x}
                        cy={z.y}
                        rx={z.rx + (isActive ? 1.5 : 0)}
                        ry={z.ry + (isActive ? 1.2 : 0)}
                        className={cn('transition-all duration-200', style.fill, style.text.split(' ')[1])}
                        strokeWidth={isActive ? 1.4 : 0.8}
                        strokeDasharray={z.id === 'metro-manila' ? undefined : '3 1.6'}
                      />
                      <text
                        x={z.x}
                        y={z.y + 1.4}
                        textAnchor="middle"
                        className={cn('fill-current font-bold', style.text)}
                        fontSize={z.id === 'metro-manila' ? 4.6 : 3.4}
                      >
                        {z.name}
                      </text>
                      {isActive && (
                        <circle cx={z.x + z.rx - 1} cy={z.y - z.ry + 1} r="1.4" className="fill-primary animate-pulse" />
                      )}
                    </g>
                  )
                })}
              </svg>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-muted-foreground">
                <Info className="h-3.5 w-3.5" aria-hidden />
                Schematic map — tap or click a zone for details
              </p>
            </div>
          </Reveal>

          {/* Zone detail + list */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border bg-card p-6 shadow-sm"
                aria-live="polite"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight">{active.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.cities}</p>

                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3.5 py-2.5">
                    <dt className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <CarFront className="h-4 w-4" aria-hidden /> Travel fee
                    </dt>
                    <dd className={cn('font-extrabold', active.travelFee === 'FREE' ? 'text-primary' : 'text-foreground')}>
                      {active.travelFee}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3.5 py-2.5">
                    <dt className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <Clock3 className="h-4 w-4" aria-hidden /> Booking lead time
                    </dt>
                    <dd className="font-bold">{active.eta}</dd>
                  </div>
                </dl>

                <Button className="mt-5 w-full rounded-full font-bold" onClick={() => scrollToId('booking')}>
                  <Navigation className="mr-1.5 h-4 w-4" aria-hidden />
                  Book a clean in {active.name}
                </Button>
              </motion.div>
            </AnimatePresence>

            {/* quick zone chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {AREA_ZONES.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setActive(z)}
                  aria-pressed={active.id === z.id}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                    active.id === z.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {z.name}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
              Travel fees are estimates confirmed with your final quote. Not sure if we cover your street? Message us
              on Facebook — we usually do.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
