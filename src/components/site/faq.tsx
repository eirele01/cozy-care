'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { FAQS, BUSINESS } from '@/lib/business'

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Good to know"
          title="Questions, answered honestly"
          sub="Can't find your answer? Message us on Facebook or call — a real human replies, every day."
        />

        <Reveal>
          <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5 shadow-sm md:px-6">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className={i === FAQS.length - 1 ? 'border-b-0' : ''}>
                <AccordionTrigger className="py-4 text-left text-[15px] font-bold hover:no-underline hover:text-primary">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[14.5px] leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Still curious?{' '}
            <a href={BUSINESS.phoneHref} className="font-bold text-primary underline underline-offset-2">
              Call {BUSINESS.phone}
            </a>{' '}
            — {BUSINESS.hours.toLowerCase()}.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
