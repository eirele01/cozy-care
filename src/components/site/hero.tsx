'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck, CalendarCheck, Wallet, ArrowRight, Star, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BUSINESS } from '@/lib/business'
import { scrollToId } from '@/lib/store'

const ease = [0.21, 0.47, 0.32, 0.98] as const

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-20">
      {/* soft background wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_20%,oklch(0.596_0.145_163.225/0.12),transparent),radial-gradient(45%_40%_at_15%_80%,oklch(0.828_0.189_84.429/0.10),transparent)]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        {/* Copy */}
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Badge variant="outline" className="rounded-full border-primary/30 bg-secondary px-3.5 py-1.5 text-[13px] font-bold text-secondary-foreground">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
              Metro Manila&apos;s trusted deep cleaning service
            </Badge>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
            className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]"
          >
            Come home to a{' '}
            <span className="relative whitespace-nowrap text-primary">
              deeply clean
              <svg
                aria-hidden
                className="absolute -bottom-2 left-0 w-full text-amber-400"
                viewBox="0 0 220 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path d="M3 9C60 3 160 3 217 8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>{' '}
            space.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            CozyCare PH delivers intensive, detail-obsessed deep cleaning for homes and offices across
            Metro Manila — starting at <strong className="font-bold text-foreground">₱1,099</strong> for 15–30 sqm.
            Get an instant quote, pick your schedule, and we handle the rest.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" className="h-12 rounded-full px-6 text-[15px] font-bold shadow-md" onClick={() => scrollToId('calculator')}>
              Get Instant Estimate
              <ArrowRight className="ml-1 h-4.5 w-4.5" aria-hidden />
            </Button>
            <Button size="lg" variant="outline" className="h-12 rounded-full px-6 text-[15px] font-bold" onClick={() => scrollToId('booking')}>
              Book a Cleaning
            </Button>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-foreground/75"
          >
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              4.9/5 rated by clients
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarCheck className="h-4 w-4 text-primary" aria-hidden />
              Open every day, 8AM–6PM
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
              Vetted, trained cleaners
            </span>
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border shadow-xl">
            <Image
              src="/images/hero-team.png"
              alt="CozyCare PH professional cleaning team ready to deep clean a bright Filipino home"
              width={1440}
              height={720}
              priority
              className="h-full w-full object-cover aspect-[16/10]"
            />
          </div>

          {/* floating stat card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease }}
            className="absolute -bottom-5 left-4 rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur sm:left-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Home className="h-5.5 w-5.5" aria-hidden />
              </span>
              <div>
                <p className="text-xl font-extrabold leading-none">{BUSINESS.homesServed}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">homes & offices served</p>
              </div>
            </div>
          </motion.div>

          {/* floating price chip */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease }}
            className="absolute -top-4 right-4 sm:right-8 flex items-center gap-2 rounded-full border bg-card/95 px-4 py-2.5 shadow-lg backdrop-blur"
          >
            <Wallet className="h-4.5 w-4.5 text-amber-500" aria-hidden />
            <span className="text-sm font-bold">From ₱800 — no hidden fees</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
