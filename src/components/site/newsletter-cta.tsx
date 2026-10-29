'use client'

import { useState } from 'react'
import { Gift, Loader2, MailCheck, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Reveal } from './reveal'
import { scrollToId } from '@/lib/store'
import { toast } from 'sonner'

export function NewsletterCta() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const subscribe = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error('Please enter a valid email address.')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? 'Subscription failed.')
        return
      }
      setDone(true)
      toast.success('You\'re on the list! Watch your inbox for fresh tips. 🧹')
    } catch {
      toast.error('Network error — please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section aria-label="Book now and newsletter" className="pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground shadow-lg md:px-12 md:py-16">
            {/* decorative bubbles */}
            <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <span aria-hidden className="pointer-events-none absolute right-[12%] top-8 text-2xl opacity-30">✨</span>
            <span aria-hidden className="pointer-events-none absolute left-[14%] bottom-10 text-2xl opacity-30">🫧</span>

            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
              Your space deserves the CozyCare feeling.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-primary-foreground/90 md:text-base">
              Book your first deep clean today — from ₱1,099, open every day. Or drop your email for cleaning tips,
              seasonal promos, and subscriber-only discounts.
            </p>

            <div className="mx-auto mt-8 flex max-w-lg flex-col items-center gap-3 sm:flex-row">
              {done ? (
                <p className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-bold" role="status">
                  <MailCheck className="h-5 w-5" aria-hidden />
                  Subscribed! Salamat — see you in your inbox.
                </p>
              ) : (
                <>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && subscribe()}
                    aria-label="Email address"
                    className="h-12 flex-1 rounded-full border-white/30 bg-white/95 text-foreground placeholder:text-muted-foreground focus-visible:ring-white"
                  />
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={subscribe}
                    disabled={sending}
                    className="h-12 rounded-full px-6 font-bold text-secondary-foreground shadow-md"
                  >
                    {sending ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden />
                    ) : (
                      <>
                        <Gift className="mr-1.5 h-4.5 w-4.5" aria-hidden />
                        Get tips & promos
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>

            <button
              onClick={() => scrollToId('booking')}
              className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-white underline underline-offset-4 hover:opacity-90"
            >
              <Send className="h-3.5 w-3.5" aria-hidden />
              Or go straight to booking — takes under a minute
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
