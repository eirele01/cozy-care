'use client'

import Image from 'next/image'
import { Check, Calculator, ArrowRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { SERVICES, type ServiceId } from '@/lib/business'
import { useBookingStore, scrollToId } from '@/lib/store'
import { cn } from '@/lib/utils'

export function Services() {
  const setPrefill = useBookingStore((s) => s.setPrefill)

  const estimateThis = (id: ServiceId) => {
    setPrefill(id)
    scrollToId('calculator')
  }

  return (
    <section id="services" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we clean"
          title="Deep cleaning for every kind of mess"
          sub="Pick a service to see exactly what's included — then get your instant estimate in under a minute."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc, i) => (
            <Reveal key={svc.id} delay={(i % 3) * 0.08} className="h-full">
              <article
                className={cn(
                  'group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
                  svc.popular && 'ring-2 ring-primary/60'
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={svc.image}
                    alt={`${svc.name} — CozyCare PH`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {svc.popular ? (
                    <Badge className="absolute left-3 top-3 gap-1 rounded-full bg-primary font-bold shadow">
                      <Sparkles className="h-3 w-3" aria-hidden /> Most booked
                    </Badge>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="text-lg font-extrabold tracking-tight">{svc.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary">{svc.short}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{svc.description}</p>

                  <ul className="mt-4 space-y-2">
                    {svc.includes.slice(0, 4).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] leading-snug text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Starting at
                        </p>
                        <p className="text-xl font-extrabold text-primary">
                          ₱{svc.startingPrice.toLocaleString('en-PH')}
                          <span className="ml-1 text-xs font-semibold text-muted-foreground">{svc.startingLabel}</span>
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full font-bold"
                        onClick={() => estimateThis(svc.id)}
                      >
                        <Calculator className="mr-1 h-4 w-4" aria-hidden />
                        Estimate
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          {/* CTA card */}
          <Reveal delay={0.16} className="h-full">
            <article className="flex h-full flex-col justify-between rounded-2xl bg-primary p-6 text-primary-foreground shadow-md md:p-7">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">Not sure which service fits?</h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/90">
                  Answer two quick questions — your space size and service type — and our calculator gives you a
                  real price range instantly. No forms, no waiting for a callback.
                </p>
                <ul className="mt-4 space-y-2 text-sm font-medium text-primary-foreground/90">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" aria-hidden /> Instant, transparent estimates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" aria-hidden /> No hidden fees — ever
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" aria-hidden /> Final quote confirmed on-site
                  </li>
                </ul>
              </div>
              <Button
                variant="secondary"
                className="mt-6 w-full rounded-full font-bold text-secondary-foreground"
                onClick={() => scrollToId('calculator')}
              >
                Try the price calculator
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
              </Button>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
