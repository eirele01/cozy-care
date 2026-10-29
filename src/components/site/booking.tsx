'use client'

import { useEffect, useMemo, useState } from 'react'
import { format, addDays } from 'date-fns'
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Phone,
  NotebookPen,
  Search,
  CheckCircle2,
  CalendarCheck2,
  Loader2,
  PartyPopper,
  RotateCcw,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { SERVICES, type ServiceId } from '@/lib/business'
import { calculateEstimate, formatPeso } from '@/lib/pricing'
import { useBookingStore } from '@/lib/store'
import { useMounted } from '@/hooks/use-mounted'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const TIME_SLOTS = ['8:00 AM – 11:00 AM', '11:00 AM – 2:00 PM', '2:00 PM – 5:00 PM']

interface BookingRecord {
  id: string
  reference: string
  name: string
  serviceType: string
  spaceSize: string
  preferredDate: string
  timeSlot: string
  address: string
  status: string
  estimate: number | null
}

export function BookingSection() {
  const prefillService = useBookingStore((s) => s.prefillService)
  const prefillSqm = useBookingStore((s) => s.prefillSqm)
  const prefillStamp = useBookingStore((s) => s.prefillStamp)

  const mounted = useMounted()
  const [tab, setTab] = useState('book')
  const [serviceId, setServiceId] = useState<ServiceId>(prefillService)
  const [sqm, setSqm] = useState(prefillSqm)
  const [carpetRooms, setCarpetRooms] = useState(1)
  const [dateIdx, setDateIdx] = useState(0)
  const [slot, setSlot] = useState<string>('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState<BookingRecord | null>(null)

  // track tab
  const [trackPhone, setTrackPhone] = useState('')
  const [tracking, setTracking] = useState(false)
  const [trackResults, setTrackResults] = useState<BookingRecord[] | null>(null)

  // react to calculator "Book this service" prefill
  useEffect(() => {
    if (prefillStamp === 0) return
    setServiceId(prefillService)
    setSqm(prefillSqm)
    setConfirmed(null)
    setTab('book') // always land on the booking form
  }, [prefillStamp, prefillService, prefillSqm])

  const days = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)),
    []
  )

  const isCarpet = serviceId === 'carpet'
  const spaceSize = isCarpet
    ? `${carpetRooms} room${carpetRooms > 1 ? 's' : ''} / area${carpetRooms >= 4 ? ' (whole home)' : ''}`
    : `${sqm} sqm`

  const estimate = useMemo(
    () => calculateEstimate(serviceId, sqm, carpetRooms),
    [serviceId, sqm, carpetRooms]
  )

  const submit = async () => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      toast.error('Please enter your full name.')
      return
    }
    if (!/^[0-9+\-\s()]{10,20}$/.test(form.phone.trim())) {
      toast.error('Please enter a valid Philippine mobile number (e.g. 0917 123 4567).')
      return
    }
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      toast.error('That email doesn\'t look right — please check it.')
      return
    }
    if (form.address.trim().length < 5) {
      toast.error('Please enter the complete service address (with city).')
      return
    }
    if (!slot) {
      toast.error('Please pick a preferred time slot.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          serviceType: serviceId,
          spaceSize,
          preferredDate: format(days[dateIdx], 'yyyy-MM-dd'),
          timeSlot: slot,
          estimate: estimate.estimate || undefined,
          notes: form.notes.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? 'Booking failed. Please try again.')
        return
      }
      setConfirmed(data.booking)
      toast.success('Booking request received! 🎉')
    } catch {
      toast.error('Network error — please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const track = async () => {
    if (trackPhone.trim().length < 7) {
      toast.error('Enter the mobile number you used when booking.')
      return
    }
    setTracking(true)
    try {
      const res = await fetch(`/api/bookings?phone=${encodeURIComponent(trackPhone.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? 'Lookup failed.')
        return
      }
      setTrackResults(data.bookings)
    } catch {
      toast.error('Network error — please try again.')
    } finally {
      setTracking(false)
    }
  }

  const resetForm = () => {
    setConfirmed(null)
    setSlot('')
    setForm({ name: '', phone: '', email: '', address: '', notes: '' })
  }

  return (
    <section id="booking" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Real-time booking"
          title="Pick a day. Lock your slot. That's it."
          sub="We're open every day of the week. Choose your schedule below and get instant confirmation with a booking reference — we'll follow up via SMS to finalize details."
        />

        <Reveal>
          <Tabs value={tab} onValueChange={setTab} className="rounded-3xl border bg-card shadow-sm">
            <div className="border-b px-6 pt-5 md:px-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="book" className="gap-1.5 font-bold">
                  <CalendarCheck2 className="h-4 w-4" aria-hidden /> Book
                </TabsTrigger>
                <TabsTrigger value="track" className="gap-1.5 font-bold">
                  <Search className="h-4 w-4" aria-hidden /> Track booking
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ------------------------------- BOOK ------------------------------ */}
            <TabsContent value="book" className="p-6 md:p-8">
              {confirmed ? (
                <div className="py-4 text-center" role="status">
                  <div>
                    <PartyPopper className="mx-auto h-14 w-14 text-primary" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-2xl font-extrabold tracking-tight">Booking request received!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Salamat, {confirmed.name.split(' ')[0]}! Our team will confirm your slot via SMS at{' '}
                    <strong className="text-foreground">{confirmed.phone}</strong> within the hour.
                  </p>

                  <div className="mx-auto mt-6 max-w-md rounded-2xl border bg-secondary/60 p-5 text-left">
                    <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Your booking reference
                    </p>
                    <p className="mt-1 text-center text-3xl font-extrabold tracking-tight text-primary">
                      {confirmed.reference}
                    </p>
                    <dl className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Service</dt>
                        <dd className="text-right font-bold">
                          {SERVICES.find((s) => s.id === confirmed.serviceType)?.name}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Schedule</dt>
                        <dd className="text-right font-bold">
                          {format(new Date(confirmed.preferredDate + 'T00:00:00'), 'EEE, MMM d, yyyy')}
                          <span className="block text-xs font-semibold text-muted-foreground">{confirmed.timeSlot}</span>
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Space</dt>
                        <dd className="text-right font-bold">{confirmed.spaceSize}</dd>
                      </div>
                      {confirmed.estimate ? (
                        <div className="flex justify-between gap-4">
                          <dt className="text-muted-foreground">Estimate</dt>
                          <dd className="text-right font-bold text-primary">{formatPeso(confirmed.estimate)}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>

                  <div className="mx-auto mt-5 max-w-md text-left text-[13px] leading-relaxed text-muted-foreground">
                    <p className="font-bold text-foreground">What happens next?</p>
                    <p>1. We confirm your slot & final quote via SMS or Messenger.</p>
                    <p>2. Your crew arrives on schedule, fully equipped.</p>
                    <p>3. Pay after the clean — GCash, Maya, bank, or cash.</p>
                  </div>

                  <Button variant="outline" className="mt-6 rounded-full font-bold" onClick={resetForm}>
                    <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden />
                    Make another booking
                  </Button>
                </div>
              ) : (
                <div className="grid gap-8 lg:grid-cols-5">
                  <div className="lg:col-span-3">
                    {/* date strip */}
                    <fieldset>
                      <legend className="flex items-center gap-2 text-sm font-bold">
                        <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
                        1. Choose a date <span className="font-semibold text-muted-foreground">(we're open daily!)</span>
                      </legend>
                      <div
                        className="scroll-slim mt-3 flex gap-2 overflow-x-auto pb-2"
                        role="radiogroup"
                        aria-label="Preferred date"
                      >
                        {(mounted ? days : Array.from({ length: 14 })).map((d, i) => (
                          <button
                            key={i}
                            role="radio"
                            aria-checked={dateIdx === i}
                            disabled={!mounted}
                            onClick={() => setDateIdx(i)}
                            className={cn(
                              'flex min-w-[68px] shrink-0 flex-col items-center rounded-xl border-2 px-2.5 py-2.5 transition-all focus-visible:outline-2 focus-visible:outline-ring',
                              dateIdx === i
                                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                : 'border-border bg-background hover:border-primary/40'
                            )}
                          >
                            <span className="text-[10.5px] font-bold uppercase tracking-wide opacity-80">
                              {mounted ? format(days[i], 'EEE') : '—'}
                            </span>
                            <span className="text-lg font-extrabold leading-tight">
                              {mounted ? format(days[i], 'd') : '·'}
                            </span>
                            <span className="text-[10.5px] font-semibold opacity-80">
                              {mounted ? format(days[i], 'MMM') : '—'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* time slots */}
                    <fieldset className="mt-6">
                      <legend className="flex items-center gap-2 text-sm font-bold">
                        <Clock className="h-4 w-4 text-primary" aria-hidden />
                        2. Preferred time
                      </legend>
                      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Preferred time slot">
                        {TIME_SLOTS.map((t) => (
                          <button
                            key={t}
                            role="radio"
                            aria-checked={slot === t}
                            onClick={() => setSlot(t)}
                            className={cn(
                              'rounded-full border-2 px-4 py-2 text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-ring',
                              slot === t
                                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                : 'border-border bg-background hover:border-primary/40'
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* contact details */}
                    <fieldset className="mt-6">
                      <legend className="flex items-center gap-2 text-sm font-bold">
                        <User className="h-4 w-4 text-primary" aria-hidden />
                        3. Your details
                      </legend>
                      <div className="mt-3 grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-1.5">
                          <Label htmlFor="bk-name">Full name *</Label>
                          <Input
                            id="bk-name"
                            placeholder="Juan Dela Cruz"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            autoComplete="name"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="bk-phone">Mobile number *</Label>
                          <Input
                            id="bk-phone"
                            type="tel"
                            placeholder="0917 123 4567"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            autoComplete="tel"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="bk-email">Email (optional)</Label>
                          <Input
                            id="bk-email"
                            type="email"
                            placeholder="you@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            autoComplete="email"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="bk-address" className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden /> Service address *
                          </Label>
                          <Input
                            id="bk-address"
                            placeholder="Unit 12B Tower, Brgy., City"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            autoComplete="street-address"
                          />
                        </div>
                        <div className="grid gap-1.5 sm:col-span-2">
                          <Label htmlFor="bk-notes" className="flex items-center gap-1">
                            <NotebookPen className="h-3.5 w-3.5 text-primary" aria-hidden /> Special notes (pets?
                            priority areas? product preference?)
                          </Label>
                          <Textarea
                            id="bk-notes"
                            placeholder="e.g. We have 2 cats — please use pet-safe products. Focus on the kitchen."
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            rows={2}
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  {/* summary sidebar */}
                  <aside className="lg:col-span-2">
                    <div className="sticky top-24 rounded-2xl border bg-secondary/50 p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Booking summary</p>

                      <div className="mt-3 grid gap-1.5">
                        <Label htmlFor="bk-service">Service</Label>
                        <select
                          id="bk-service"
                          value={serviceId}
                          onChange={(e) => setServiceId(e.target.value as ServiceId)}
                          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          {SERVICES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {isCarpet ? (
                        <div className="mt-4">
                          <Label className="mb-2 block">Carpeted rooms</Label>
                          <div className="flex flex-wrap gap-1.5">
                            {[1, 2, 3, 4].map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setCarpetRooms(r)}
                                aria-pressed={carpetRooms === r}
                                className={cn(
                                  'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
                                  carpetRooms === r
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border hover:border-primary/40'
                                )}
                              >
                                {r === 4 ? '4+' : r}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between">
                            <Label>Space size</Label>
                            <span className="text-sm font-extrabold text-primary">{sqm} sqm</span>
                          </div>
                          <Slider
                            value={[sqm]}
                            onValueChange={(v) => setSqm(v[0])}
                            min={5}
                            max={150}
                            step={5}
                            aria-label="Space size in square meters"
                          />
                        </div>
                      )}

                      <dl className="mt-5 space-y-2 border-t pt-4 text-sm">
                        <div className="flex justify-between gap-3">
                          <dt className="text-muted-foreground">Date</dt>
                          <dd className="font-bold">{mounted ? format(days[dateIdx], 'EEE, MMM d') : '—'}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-muted-foreground">Time</dt>
                          <dd className={cn('font-bold', !slot && 'text-muted-foreground')}>{slot || 'Not picked'}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-muted-foreground">Space</dt>
                          <dd className="font-bold">{spaceSize}</dd>
                        </div>
                        <div className="flex justify-between gap-3 border-t pt-3">
                          <dt className="font-bold">Estimated total</dt>
                          <dd className="text-lg font-extrabold text-primary">{estimate.priceLabel}</dd>
                        </div>
                      </dl>

                      <Button onClick={submit} disabled={submitting} className="mt-5 h-12 w-full rounded-full text-[15px] font-bold shadow-sm">
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" aria-hidden />
                            Sending request…
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-1.5 h-4.5 w-4.5" aria-hidden />
                            Confirm booking request
                          </>
                        )}
                      </Button>
                      <p className="mt-3 flex items-center justify-center gap-1 text-center text-[11.5px] leading-snug text-muted-foreground">
                        <Phone className="h-3 w-3" aria-hidden />
                        Need help? Call {`+63 954-324-5023`} — we answer daily 8AM–6PM
                      </p>
                    </div>
                  </aside>
                </div>
              )}
            </TabsContent>

            {/* ------------------------------- TRACK ----------------------------- */}
            <TabsContent value="track" className="p-6 md:p-8">
              <div className="mx-auto max-w-xl">
                <p className="text-sm text-muted-foreground">
                  Enter the mobile number you booked with to see your cleaning schedule and booking references.
                </p>
                <div className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                    <Input
                      type="tel"
                      placeholder="0917 123 4567"
                      value={trackPhone}
                      onChange={(e) => setTrackPhone(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && track()}
                      className="pl-9"
                      aria-label="Mobile number used for booking"
                    />
                  </div>
                  <Button onClick={track} disabled={tracking} className="rounded-full font-bold">
                    {tracking ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Search className="h-4 w-4" aria-hidden />}
                    <span className="ml-1.5">Find bookings</span>
                  </Button>
                </div>

                {trackResults && (
                  <div className="mt-6">
                    {trackResults.length === 0 ? (
                      <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No bookings found for this number yet. Try the number you entered on the booking form —
                        or make your first booking in the Book tab!
                      </div>
                    ) : (
                      <ul className="scroll-slim max-h-96 space-y-3 overflow-y-auto pr-1" aria-label="Your bookings">
                        {trackResults.map((b) => (
                          <li key={b.id} className="rounded-2xl border bg-background p-4 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-sm font-extrabold text-primary">
                                {b.reference}
                              </span>
                              <span
                                className={cn(
                                  'rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide',
                                  b.status === 'COMPLETED'
                                    ? 'bg-muted text-muted-foreground'
                                    : b.status === 'CANCELLED'
                                      ? 'bg-destructive/10 text-destructive'
                                      : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                )}
                              >
                                {b.status}
                              </span>
                            </div>
                            <p className="mt-2 font-bold">{SERVICES.find((s) => s.id === b.serviceType)?.name}</p>
                            <p className="mt-1 text-[13px] text-muted-foreground">
                              {format(new Date(b.preferredDate + 'T00:00:00'), 'EEEE, MMMM d, yyyy')} · {b.timeSlot}
                            </p>
                            <p className="text-[13px] text-muted-foreground">
                              {b.spaceSize}
                              {b.estimate ? ` · est. ${formatPeso(b.estimate)}` : ''}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Reveal>
      </div>
    </section>
  )
}
