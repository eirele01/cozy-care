import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { SERVICES } from '@/lib/business'

const bookingSchema = z.object({
  name: z.string().min(2, 'Please enter your full name').max(80),
  phone: z
    .string()
    .min(10, 'Enter a valid PH mobile number')
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  address: z.string().min(5, 'Enter the full service address').max(200),
  serviceType: z.string().refine((v) => SERVICES.some((s) => s.id === v), 'Unknown service'),
  spaceSize: z.string().min(1).max(60),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date'),
  timeSlot: z.string().min(1).max(40),
  estimate: z.number().int().nonnegative().optional(),
  notes: z.string().max(500).optional().or(z.literal('')),
})

const REF_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
function makeReference() {
  let s = ''
  for (let i = 0; i < 6; i++) {
    s += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)]
  }
  return `CCP-${s}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid booking details' },
        { status: 400 }
      )
    }

    const data = parsed.data

    // prevent duplicate slot spam: same phone + date + slot within 5 minutes
    const recent = await db.booking.findFirst({
      where: {
        phone: data.phone,
        preferredDate: data.preferredDate,
        timeSlot: data.timeSlot,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
    })
    if (recent) {
      return NextResponse.json(
        { error: 'You already have a booking request for this slot. We\'ll confirm it shortly!' },
        { status: 409 }
      )
    }

    let reference = makeReference()
    // ensure uniqueness
    for (let i = 0; i < 5; i++) {
      const exists = await db.booking.findUnique({ where: { reference } })
      if (!exists) break
      reference = makeReference()
    }

    const booking = await db.booking.create({
      data: {
        reference,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        address: data.address.trim(),
        serviceType: data.serviceType,
        spaceSize: data.spaceSize,
        preferredDate: data.preferredDate,
        timeSlot: data.timeSlot,
        estimate: data.estimate ?? null,
        notes: data.notes?.trim() || null,
      },
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json(
      { error: 'Something went wrong saving your booking. Please try again or message us directly.' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const phone = req.nextUrl.searchParams.get('phone')?.trim() ?? ''
    if (phone.length < 7) {
      return NextResponse.json({ error: 'Enter the mobile number you booked with' }, { status: 400 })
    }

    const digits = phone.replace(/\D/g, '')
    const bookings = await db.booking.findMany({
      where: {
        phone: { contains: digits.slice(-10) },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({ bookings })
  } catch (err) {
    console.error('Booking lookup error:', err)
    return NextResponse.json({ error: 'Lookup failed. Please try again.' }, { status: 500 })
  }
}
