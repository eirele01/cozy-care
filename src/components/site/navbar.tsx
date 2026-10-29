'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, Menu, Phone, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { BUSINESS } from '@/lib/business'
import { scrollToId } from '@/lib/store'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Services', id: 'services' },
  { label: 'Instant Quote', id: 'calculator' },
  { label: 'Results', id: 'results' },
  { label: 'Book', id: 'booking' },
  { label: 'Areas', id: 'areas' },
  { label: 'Our Team', id: 'team' },
  { label: 'Reviews', id: 'reviews' },
  { label: 'Tips', id: 'tips' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/85 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'
      )}
    >
      <nav
        className="mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="CozyCare PH — back to top"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-left leading-none">
            <span className="block text-[17px] font-extrabold tracking-tight">
              CozyCare <span className="text-primary">PH</span>
            </span>
            <span className="block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Cleaning Services
            </span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-secondary transition-colors focus-visible:outline-2 focus-visible:outline-ring"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={BUSINESS.phoneHref}
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-primary hover:bg-secondary transition-colors focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {BUSINESS.phone}
          </a>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            className="rounded-full"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5" aria-hidden />
            ) : (
              <Moon className="h-5 w-5" aria-hidden />
            )}
          </Button>

          <Button
            onClick={() => go('booking')}
            className="hidden sm:inline-flex rounded-full font-bold shadow-sm"
          >
            Book Now
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full" aria-label="Open menu">
                <Menu className="h-5.5 w-5.5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetTitle className="flex items-center gap-2 text-lg font-extrabold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4.5 w-4.5" aria-hidden />
                </span>
                CozyCare PH
              </SheetTitle>
              <div className="mt-4 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => go(l.id)}
                    className="rounded-lg px-3 py-2.5 text-left text-[15px] font-semibold hover:bg-secondary transition-colors"
                  >
                    {l.label}
                  </button>
                ))}
                <div className="my-2 h-px bg-border" role="separator" />
                <Button onClick={() => go('booking')} className="rounded-full font-bold">
                  Book a Cleaning
                </Button>
                <a
                  href={BUSINESS.phoneHref}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-bold text-primary"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {BUSINESS.phone}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
