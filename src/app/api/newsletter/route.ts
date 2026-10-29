import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({
  email: z.string().email('Enter a valid email address').max(120),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid email' }, { status: 400 })
    }

    await db.newsletterSubscriber.upsert({
      where: { email: parsed.data.email.toLowerCase().trim() },
      update: {},
      create: { email: parsed.data.email.toLowerCase().trim() },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('Newsletter error:', err)
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 })
  }
}
