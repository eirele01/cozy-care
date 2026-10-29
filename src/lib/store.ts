import { create } from 'zustand'
import type { ServiceId } from '@/lib/business'

interface BookingStore {
  /** service pre-selected from the pricing calculator / service cards */
  prefillService: ServiceId
  prefillSqm: number
  prefillStamp: number // increments to trigger UI reaction
  setPrefill: (service: ServiceId, sqm?: number) => void
}

export const useBookingStore = create<BookingStore>((set) => ({
  prefillService: 'general',
  prefillSqm: 25,
  prefillStamp: 0,
  setPrefill: (service, sqm) =>
    set((s) => ({
      prefillService: service,
      prefillSqm: sqm ?? s.prefillSqm,
      prefillStamp: s.prefillStamp + 1,
    })),
}))

export function scrollToId(id: string) {
  if (typeof document === 'undefined') return
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
