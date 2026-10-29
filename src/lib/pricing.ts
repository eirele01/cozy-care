import { CARPET_TIERS, SERVICES, SIZE_TIERS, type ServiceId } from './business'

export interface PricingResult {
  ok: boolean
  estimate: number
  priceLabel: string
  tierNote: string
  serviceName: string
}

/**
 * Instant estimate engine.
 * General-family services: size-tier base × service multiplier.
 * Carpet: per-room pricing.
 * Returns an "from ₱X" style estimate. Final quote confirmed upon assessment.
 */
export function calculateEstimate(serviceId: string, sqm: number | null, rooms: number | null): PricingResult {
  const service = SERVICES.find((s) => s.id === serviceId) ?? SERVICES[0]

  if (serviceId === 'carpet') {
    const tier = CARPET_TIERS.find((t) => t.rooms === (rooms ?? 1)) ?? CARPET_TIERS[CARPET_TIERS.length - 1]
    return {
      ok: true,
      estimate: tier.price,
      priceLabel: `from ₱${tier.price.toLocaleString('en-PH')}`,
      tierNote: tier.label,
      serviceName: service.name,
    }
  }

  const cleanSqm = Math.min(Math.max(Math.round(sqm ?? 25), 1), 9999)
  const tier =
    SIZE_TIERS.find((t) => cleanSqm >= t.min && cleanSqm <= t.max) ?? SIZE_TIERS[SIZE_TIERS.length - 1]

  if (tier.base === 0) {
    return {
      ok: false,
      estimate: 0,
      priceLabel: 'Custom quote',
      tierNote: 'For 121+ sqm we provide a free ocular estimate — book a visit and we\'ll measure.',
      serviceName: service.name,
    }
  }

  const raw = tier.base * service.priceMultiplier
  // keep published flagship rates exact (e.g. ₱1,099), round derived prices to nearest ₱50
  const estimate = service.priceMultiplier === 1 ? tier.base : Math.round(raw / 50) * 50

  return {
    ok: true,
    estimate,
    priceLabel: `from ₱${estimate.toLocaleString('en-PH')}`,
    tierNote: `${tier.label} • ${tier.note ?? ''}`,
    serviceName: service.name,
  }
}

export function formatPeso(n: number): string {
  return `₱${n.toLocaleString('en-PH')}`
}

export type { ServiceId }
