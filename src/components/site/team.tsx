'use client'

import Image from 'next/image'
import { BadgeCheck } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { TEAM } from '@/lib/business'

export function Team() {
  return (
    <section id="team" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Meet your cleaners"
          title="The people behind the sparkle"
          sub="We're proud of our crew — vetted, trained, background-checked, and genuinely fun to have around your home. Get to know them before they knock on your door."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {TEAM.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.08} className="h-full">
              <article className="group h-full overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[4/4.2] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role} at CozyCare PH`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                    {member.years}
                  </span>
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-lg font-extrabold tracking-tight">{member.name}</h3>
                  <p className="text-sm font-semibold text-primary">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {member.skills.map((s) => (
                      <li
                        key={s}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-foreground"
                      >
                        <BadgeCheck className="h-3 w-3 text-primary" aria-hidden />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-secondary/60 p-4 text-center text-[13px] leading-relaxed text-muted-foreground">
            <strong className="font-bold text-foreground">Our promise:</strong> every CozyCare cleaner passes a
            background check, completes our 42-point training program, and follows a strict respect-at-home code —
            no shoe marks, no wasted water, no wandering into private rooms unannounced.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
