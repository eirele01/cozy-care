'use client'

import { Home, CalendarDays, BadgePercent, Users } from 'lucide-react'
import { Reveal } from './reveal'
import { BUSINESS } from '@/lib/business'

const STATS = [
  { icon: Home, value: BUSINESS.homesServed, label: 'Homes & offices served' },
  { icon: CalendarDays, value: '7 days a week', label: 'Including weekends & holidays' },
  { icon: BadgePercent, value: 'From ₱800', label: 'Transparent, tiered pricing' },
  { icon: Users, value: '100% vetted', label: 'Trained, background-checked crew' },
]

export function TrustBar() {
  return (
    <section aria-label="Trust indicators" className="border-y bg-secondary/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="h-5.5 w-5.5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-base md:text-lg font-extrabold leading-tight">{s.value}</p>
              <p className="text-xs md:text-[13px] font-medium text-muted-foreground truncate">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
