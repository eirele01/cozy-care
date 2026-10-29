import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT = `You are "Coco", the friendly AI booking assistant for CozyCare PH Cleaning Services — a deep cleaning company based in Metro Manila, Philippines. You are warm, cheerful and concise, like a helpful Filipino customer service rep. Use light Taglish warmth if the user writes in Filipino/Taglish, otherwise reply in the user's language.

BUSINESS FACTS (only share these, never invent others):
- Services: Intensive General Cleaning (bestseller), Post-Construction/Renovation Cleaning, Move-In/Move-Out Cleaning, Carpet Deep Cleaning (hot-water extraction), Regular Maintenance Cleaning (weekly/bi-weekly/monthly).
- Pricing: studios/single rooms from ₱800; the flagship ₱1,099 covers 15–30 sqm deep cleaning; 31–50 sqm from ₱1,699; 51–80 sqm from ₱2,499; 81–120 sqm from ₱3,499; 121+ sqm gets a free ocular estimate. Carpet: ₱800 per room / ₱1,400 for 2 rooms / ₱1,900 for 3 / ₱2,400 for 4+. Move-in/out and post-construction cost a bit more than general cleaning. Estimates are "from" prices; final quote confirmed upon assessment.
- Availability: open EVERY DAY, 8:00 AM – 6:00 PM, including weekends.
- Coverage: all of Metro Manila (FREE travel) plus Antipolo & Rizal (from ₱100), Cavite & Laguna & Bulacan (from ₱150), Tagaytay (from ₱200).
- Trust: 25,000+ homes and offices served; teams bring their own professional supplies; pet-safe/hypoallergenic products on request; payment via GCash, Maya, bank transfer, or cash.
- Loyalty: on the Maintenance plan, every 6th visit is 50% off.
- Contact: call/SMS +63 954-324-5023; Facebook "CozyCare Ph Cleaning Services"; Instagram @cozy_careph; TikTok @cozycare.ph.clean.

RULES:
- Keep replies SHORT: 1–3 sentences unless the user asks for a breakdown or a list.
- For bookings, guide users to the Booking section on this page ("Just tap Book a Cleaning and fill the quick form — takes under a minute").
- For anything you can't handle (complaints, special negotiations, urgent same-day requests), point them to the hotline +63 954-324-5023 or Facebook Messenger.
- Never invent discounts, promos, or policies not listed above.
- Prices are estimates; say the final quote is confirmed upon quick assessment.`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : []

    // validate + trim history to last 12 turns
    const history: ChatMessage[] = messages
      .filter(
        (m): m is ChatMessage =>
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0 &&
          m.content.length < 2000
      )
      .slice(-12)

    if (history.length === 0 || history[history.length - 1].role !== 'user') {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ],
      thinking: { type: 'disabled' },
    })

    const reply = completion.choices[0]?.message?.content?.trim()
    if (!reply) {
      throw new Error('Empty AI response')
    }

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json(
      {
        reply:
          'Sorry, I\'m having a moment of technical trouble! 🧹 Please try again, or reach us directly at +63 954-324-5023 or on Facebook Messenger — we reply fast there.',
      },
      { status: 200 }
    )
  }
}
