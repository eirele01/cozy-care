import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ testimonials })
  } catch (err) {
    console.error('Testimonials error:', err)
    return NextResponse.json({ testimonials: [] })
  }
}
