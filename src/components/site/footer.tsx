'use client'

import { Sparkles, Phone, Facebook, Instagram, Music2, MapPin, Clock3 } from 'lucide-react'
import { BUSINESS, SERVICES } from '@/lib/business'
import { scrollToId } from '@/lib/store'

const QUICK_LINKS = [
  { label: 'Services', id: 'services' },
  { label: 'Instant Quote', id: 'calculator' },
  { label: 'Before & After', id: 'results' },
  { label: 'Book a Cleaning', id: 'booking' },
  { label: 'Service Areas', id: 'areas' },
  { label: 'Our Team', id: 'team' },
  { label: 'Reviews', id: 'reviews' },
  { label: 'Tips & Guides', id: 'tips' },
  { label: 'FAQ', id: 'faq' },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div className="leading-none">
                <p className="text-[17px] font-extrabold tracking-tight">
                  CozyCare <span className="text-primary">PH</span>
                </p>
                <p className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Cleaning Services
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Deep cleaning made cozy. Serving homes and offices across Metro Manila and nearby provinces —{' '}
              {BUSINESS.homesServed} spaces and counting.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href={BUSINESS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CozyCare PH on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Facebook className="h-4.5 w-4.5" aria-hidden />
              </a>
              <a
                href={BUSINESS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CozyCare PH on Instagram (@cozy_careph)"
                className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Instagram className="h-4.5 w-4.5" aria-hidden />
              </a>
              <a
                href={BUSINESS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CozyCare PH on TikTok (@cozycare.ph.clean)"
                className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Music2 className="h-4.5 w-4.5" aria-hidden />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-extrabold uppercase tracking-wider">Explore</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
              {QUICK_LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollToId(l.id)}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollToId('services')}
                    className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={BUSINESS.phoneHref}
                  className="flex items-start gap-2.5 font-bold text-foreground transition-colors hover:text-primary"
                >
                  <Phone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" aria-hidden />
                  {BUSINESS.phone}
                  <span className="sr-only"> — call or SMS us</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock3 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" aria-hidden />
                {BUSINESS.hours}
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" aria-hidden />
                Metro Manila · Rizal · Cavite · Laguna · Bulacan · Tagaytay
              </li>
            </ul>
            <button
              onClick={() => scrollToId('booking')}
              className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
            >
              Book Now — from ₱1,099
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-center text-xs text-muted-foreground md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
          <p>
            Demo website concept built to grow the business · Images are AI-generated placeholders pending real job
            photos.
          </p>
        </div>
      </div>
    </footer>
  )
}
