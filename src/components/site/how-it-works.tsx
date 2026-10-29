'use client'

import { MessageSquareText, CalendarCheck2, Sparkles, PartyPopper } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { scrollToId } from '@/lib/store'
import { Button } from '@/components/ui/button'

const STEPS = [
  {
    icon: MessageSquareText,
    title: 'Tell us about your space',
    desc: 'Use the instant calculator or the booking form — service type, size, and schedule. Under a minute, no callbacks required.',
  },
  {
    icon: CalendarCheck2,
    title: 'Lock in your schedule',
    desc: 'Pick any day of the week — we operate 7 days a week, 8AM–6PM. You get a confirmation with your booking reference right away.',
  },
  {
    icon: Sparkles,
    title: 'We arrive fully equipped',
    desc: 'Your vetted CozyCare team shows up on time with professional supplies and follows our 42-point deep clean checklist.',
  },
  {
    icon: PartyPopper,
    title: 'Enjoy & come back for less',
    desc: 'Walk into that fresh-home feeling. Book a maintenance plan and every 6th visit is 50% off.',
  },
]

export function HowItWorks() {
  return (
    <section aria-label="How booking works" className="bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Effortless from start to finish"
          title="Booking deep cleaning shouldn't be hard"
          sub="We removed every step that used to make people give up: no quote wait, no phone tag, no unclear pricing."
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08} className="h-full">
              <li className="relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <span
                  className="absolute -top-3 left-5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[13px] font-extrabold text-primary-foreground shadow"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-extrabold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10 text-center" delay={0.2}>
          <Button size="lg" className="h-12 rounded-full px-8 font-bold shadow-md" onClick={() => scrollToId('booking')}>
            Start your booking
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
