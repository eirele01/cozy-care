import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
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

// Local fallback used when the Z.AI gateway is unavailable (no .z-ai-config).
// Keeps the widget usable instead of always returning an error.
function localReply(text: string): string {
  const q = (text || '').toLowerCase()

  if (/(price|cost|how much|rate|quote|sqm|square|sq\.?m)/.test(q)) {
    if (/carpet/.test(q)) {
      return 'Carpet deep cleaning is ₱800 per room, ₱1,400 for 2 rooms, ₱1,900 for 3, and ₱2,400 for 4+. Final quote confirmed upon assessment — book a quick ocular and we’ll confirm! 🧽'
    }
    return 'Studios/single rooms from ₱800; ₱1,099 covers 15–30 sqm deep cleaning; 31–50 sqm from ₱1,699; 51–80 sqm from ₱2,499; 81–120 sqm from ₱3,499; 121+ sqm gets a FREE ocular estimate. Prices are "from" — final quote confirmed upon assessment. 🧽'
  }
  if (/carpet/.test(q)) {
    return 'Carpet deep cleaning uses hot-water extraction: ₱800 per room, ₱1,400 for 2, ₱1,900 for 3, ₱2,400 for 4+. Pet-odor treatment available too! 🧽'
  }
  if (/(service|cleaning type|what do you|offer)/.test(q)) {
    return 'We offer Intensive General Cleaning (bestseller), Post-Construction/Renovation, Move-In/Move-Out, Carpet Deep Cleaning, and Regular Maintenance (weekly/bi-weekly/monthly). Tap "Book a Cleaning" to get started! 🧽'
  }
  if (/(area|cover|location|travel|manila|rizal|cavite|laguna|bulacan|antipolo|tagaytay)/.test(q)) {
    return 'We cover all of Metro Manila (FREE travel), plus Antipolo & Rizal (from ₱100), Cavite, Laguna & Bulacan (from ₱150), and Tagaytay (from ₱200). 🧽'
  }
  if (/(hour|open|schedule|time|weekend|available)/.test(q)) {
    return 'We’re open EVERY DAY, 8:00 AM – 6:00 PM, including weekends! Book your slot via the Booking section. 🧽'
  }
  if (/(book|appointment|reserve|schedule a clean)/.test(q)) {
    return 'Just tap "Book a Cleaning" on this page and fill the quick form — it takes under a minute. We’ll confirm your slot fast! 🧽'
  }
  if (/(contact|phone|hotline|facebook|messenger|instagram|tiktok|call|sms)/.test(q)) {
    return 'Reach us at +63 954-324-5023 (call/SMS), Facebook "CozyCare Ph Cleaning Services", Instagram @cozy_careph, or TikTok @cozycare.ph.clean. 🧽'
  }
  if (/(maintenance|loyalty|6th|discount)/.test(q)) {
    return 'On the Maintenance plan, every 6th visit is 50% off! Regular weekly/bi-weekly/monthly cleaning keeps your home fresh. 🧽'
  }
  if (/(pet|safe|hypoallergenic|supply|supplies)/.test(q)) {
    return 'Our teams bring their own professional supplies; pet-safe and hypoallergenic products are available on request. Payment via GCash, Maya, bank transfer, or cash. 🧽'
  }

  return 'Hi! I’m Coco 🧽 Ask me about pricing, services, schedules, coverage, or booking — or reach us directly at +63 954-324-5023 / Facebook Messenger for anything urgent!'
}

function hasZaiConfig(): boolean {
  const paths = [
    path.join(process.cwd(), '.z-ai-config'),
    path.join(os.homedir(), '.z-ai-config'),
    '/etc/.z-ai-config',
  ]
  for (const filePath of paths) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const cfg = JSON.parse(raw)
      if (cfg && cfg.baseUrl && cfg.apiKey) return true
    } catch {
      // ignore
    }
  }
  return false
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

    const userMessage = history[history.length - 1].content

    // Use the Z.AI gateway when credentials are available.
    if (hasZaiConfig()) {
      try {
        const zai = await ZAI.create()

        const completion = await zai.chat.completions.create({
          messages: [
            { role: 'assistant', content: SYSTEM_PROMPT },
            ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
          ],
          thinking: { type: 'disabled' },
        })

        const reply = completion.choices[0]?.message?.content?.trim()
        if (reply) {
          return NextResponse.json({ reply })
        }
      } catch (err) {
        console.error('Chat error:', err)
      }
    }

    // Fallback so the widget stays usable without the AI gateway.
    return NextResponse.json({ reply: localReply(userMessage) })
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
