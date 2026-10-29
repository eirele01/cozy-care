# CozyCare PH Cleaning Services — Website Strategy, Content & Build Guideline

**Prepared for:** CozyCare PH Cleaning Services (Metro Manila deep cleaning, 25,000+ homes & offices served)
**References:** Facebook page, Instagram @cozy_careph, TikTok @cozycare.ph.clean
**Deliverable:** A live, interactive single-page website (Next.js) + this strategy guide.

---

## 1. Business Snapshot (what we learned)

| Fact | Detail | Website implication |
|---|---|---|
| Positioning | Deep cleaning, "affordable yet quality" | Lead with price transparency + proof of quality |
| Scale | 25,000+ households & offices served | Big trust badge above the fold |
| Flagship rate | ₱1,099 covers 15–30 sqm; from ₱800 entry | Interactive calculator, exact published rates |
| Availability | Open EVERY DAY, 8AM–6PM | Calendar always shows 14 available days |
| Coverage | Metro Manila (free) + Rizal, Cavite, Laguna, Bulacan, Tagaytay | Interactive coverage map with travel fees |
| Contact | +63 954-324-5023, FB/IG/TikTok | Click-to-call, social links, chat assistant |
| Proof style | "Seeing is believing" transformations | Draggable before/after sliders |

## 2. Positioning & Messaging

- **Tagline (hero):** "Come home to a deeply clean space."
- **Sub-message:** detail-obsessed deep cleaning from ₱1,099, instant quote, book in under a minute.
- **Tone:** warm, Filipino-friendly (light Taglish: "Salamat!", "Grabe sobrang linis"), honest about estimates.
- **Differentiators to hammer:** transparent tiered pricing • daily availability • 25,000+ cleans • vetted crew with 42-point checklist.

## 3. Site Architecture (single-page, mobile-first)

1. **Navbar** — sticky, blur-on-scroll, click-to-call, dark-mode toggle, Book Now CTA.
2. **Hero** — headline, dual CTA, floating trust chips (25,000+ served, from ₱800).
3. **Trust bar** — 4 stats (homes served, 7 days/week, from ₱800, vetted crew).
4. **Services** — 5 interactive cards + "Most booked" badge, each with inclusions & starting price.
5. **Instant Quote calculator** — service selector + sqm slider + carpet room picker → live estimate (kept exact: ₱1,099 flagship), payment options, "Book this service" pre-fills the booking form.
6. **Before & After gallery** — draggable comparison sliders, filter by service type, client quote per story.
7. **How it works** — 4 steps, no-friction narrative.
8. **Booking system** — 14-day date strip (all open), 3 time slots, form + live summary sidebar, reference code (CCP-XXXXXX), plus **Track booking** tab by mobile number.
9. **Service areas map** — clickable schematic SVG map (6 zones) with cities, travel fee, lead time.
10. **Meet your cleaners** — 3 staff profiles with certifications (humanizes brand).
11. **Reviews** — loaded from database, 5-star cards (swap in real Facebook reviews at launch).
12. **Tips & Guides hub** — 3 full articles in modals (carpet care, move-in checklist, between-visit maintenance).
13. **FAQ** — accordion answering pricing, coverage, inclusions, supplies, hours, payment, rescheduling.
14. **Newsletter + final CTA** — promo/tips capture (stored in DB).
15. **Footer** — sticky-to-bottom, full sitemap, services, contact, socials.
16. **Coco AI chat** — floating 24/7 assistant with quick-reply chips, answers pricing/coverage/schedule questions from verified business facts.

## 4. How the website solves the 4 business problems

| Problem | Solution built |
|---|---|
| **#1 Trust & credibility** | 25,000+ badge, 4.9★, vetted-crew messaging, before/after sliders with client quotes, team profiles, review wall |
| **#2 Price transparency** | Live calculator using published tiers, "what's included" lists, no-hidden-fees copy, final-quote-honesty note |
| **#3 Booking friction** | 60-second booking form, instant reference code, prefill from calculator, click-to-call, Coco AI for instant answers |
| **#4 Customer retention** | Maintenance plan with loyalty ("book 5, 6th at 50%"), Track-booking portal, preferences field (pets, products), newsletter list for promos |

## 5. Content Inventory (already written, ready to publish)

- 5 service descriptions with inclusion lists & prices
- 3 before/after transformation stories
- 3 team bios with skill badges *(sample profiles — replace with real staff, with their consent)*
- 6 seeded testimonials *(samples — replace with verified FB reviews)*
- 3 full educational articles (carpet signs, move-in checklist, between-visit habits)
- 7 FAQs, chat quick-replies, newsletter copy, meta/SEO copy + JSON-LD (HouseCleaningService schema)

## 6. Technical Notes

- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn/ui + Prisma/SQLite.
- **APIs:** `POST/GET /api/bookings`, `POST /api/chat` (AI), `POST /api/newsletter`, `GET /api/testimonials`.
- **Brand palette:** emerald primary + amber accents (fresh, clean, avoids "corporate blue").
- **Fonts:** Manrope (friendly, modern, rounded).
- **Images:** 16 AI-generated placeholders in `/public/images` — **replace with real job photos** (same filenames, zero code changes needed).
- **SEO:** metadata targeting "deep cleaning services Manila", "affordable house cleaning NCR"; JSON-LD LocalBusiness; semantic HTML + ARIA throughout; keyboard-accessible sliders and map zones.

## 7. Launch Roadmap

**Phase 1 (this build) — live demo:** showcase, calculator, booking intake, AI chat, content hub.

**Phase 2 — go-live checklist:**
1. Replace AI images with real before/after photos (keep filenames).
2. Swap seeded testimonials for real Facebook reviews (embed widget or manual export).
3. Point form notifications to the business (SMS/email integration, e.g. Twilio/Resend or Zapier).
4. Wire booking confirmations to a real calendar (Google Calendar sync) so double-booking is impossible.
5. Add GCash/Maya deep links or QR on the confirmation screen.
6. Domain + hosting (Vercel), connect to the existing Facebook/IG/TikTok bios.

**Phase 3 — growth:**
1. Client portal (login by phone): history, upcoming cleans, loyalty progress bar.
2. Subscription billing for maintenance plans (auto-charge, priority slots).
3. Referral program ("Give ₱100, get ₱100") tracked by reference codes.
4. Blog SEO engine: 2 posts/month targeting long-tail keywords ("post-construction cleaning price Philippines").
5. AI photo assessment: client uploads room photos → instant service recommendation (VLM).

## 8. KPI Dashboard (what to measure)

- Quote-calculator completions → booking conversion (target: >25%)
- Booking form abandonment (target: <40%)
- Chat-assisted bookings (target: 15% of sessions)
- Repeat bookings within 90 days (target: >30% — retention is the profit lever)
- Newsletter capture rate (target: >8%)
