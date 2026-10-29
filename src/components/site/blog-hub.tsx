'use client'

import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { BookOpen, Clock3, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { ARTICLES } from '@/lib/business'

export function BlogHub() {

  return (
    <section id="tips" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Fresh tips & guides"
          title="Keep your space cozy between cleans"
          sub="Practical, Philippines-tested home care advice from the crew that deep cleans 25,000+ spaces."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.08} className="h-full">
              <Dialog>
                <DialogTrigger asChild>
                  <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-ring">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={a.image}
                        alt={a.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                        {a.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <h3 className="text-base font-extrabold leading-snug tracking-tight group-hover:text-primary transition-colors">
                        {a.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
                      <p className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-primary">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden />
                        {a.minutes} min read
                        <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </p>
                    </div>
                  </article>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto scroll-slim">
                  <DialogHeader>
                    <DialogTitle className="text-left text-xl font-extrabold tracking-tight">{a.title}</DialogTitle>
                  </DialogHeader>
                  <div className="prose-sm text-[15px] leading-relaxed text-foreground/90 [&_p]:mb-4 [&_strong]:font-bold [&_strong]:text-primary">
                    {a.content.map((para, idx) => (
                      <ReactMarkdown key={idx}>{para}</ReactMarkdown>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-secondary/60 p-3.5 text-[13px]">
                    <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>
                      Want this handled for you? Our maintenance plans start at ₱999 per visit —{' '}
                      <span className="font-bold text-primary">book below</span>
                      .
                    </span>
                  </div>
                </DialogContent>
              </Dialog>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
