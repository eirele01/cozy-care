/**
 * CozyCare PH — central business data.
 * Single source of truth for services, pricing, coverage, FAQs and content.
 * Sources: client's Facebook page, Instagram @cozy_careph, and client brief.
 */

export const BUSINESS = {
  name: 'CozyCare PH Cleaning Services',
  shortName: 'CozyCare PH',
  tagline: 'Deep cleaning made cozy.',
  phone: '+63 954-324-5023',
  phoneHref: 'tel:+639543245023',
  hours: 'Open every day, 8:00 AM – 6:00 PM',
  facebook: 'https://web.facebook.com/p/CozyCare-Ph-Cleaning-Services-61573239081773/',
  instagram: 'https://www.instagram.com/cozy_careph/',
  tiktok: 'https://www.tiktok.com/@cozycare.ph.clean',
  homesServed: '25,000+',
  basePrice: 1099,
  entryPrice: 800,
} as const

/* ---------------------------------- Services --------------------------------- */

export type ServiceId =
  | 'general'
  | 'post-construction'
  | 'move-inout'
  | 'carpet'
  | 'maintenance'

export interface Service {
  id: ServiceId
  name: string
  short: string
  description: string
  image: string
  startingPrice: number
  startingLabel: string
  priceMultiplier: number
  includes: string[]
  bestFor: string
  popular?: boolean
}

export const SERVICES: Service[] = [
  {
    id: 'general',
    name: 'Intensive General Cleaning',
    short: 'Our best-selling full-home deep clean.',
    description:
      'A top-to-bottom, detail-obsessed deep clean of your entire home or office — surfaces, floors, bathrooms, kitchen, and those spots regular cleaning always misses.',
    image: '/images/svc-general.png',
    startingPrice: 1099,
    startingLabel: '15–30 sqm',
    priceMultiplier: 1,
    includes: [
      'Full dusting of surfaces, shelves & fixtures',
      'Kitchen degreasing (stove, counters, sink)',
      'Bathroom scrub & disinfection',
      'Floor scrubbing, vacuuming & mopping',
      'Window interiors & glass partitions',
      'Cabinet & closet interiors (on request)',
    ],
    bestFor: 'Homes that need a full reset, seasonal deep cleans, and busy families.',
    popular: true,
  },
  {
    id: 'post-construction',
    name: 'Post-Construction Cleaning',
    short: 'From renovation site to move-in ready.',
    description:
      'We remove fine cement dust, paint splatter, adhesives and debris left after renovation or construction — making your new space genuinely livable, not just looking finished.',
    image: '/images/svc-post-construction.png',
    startingPrice: 1499,
    startingLabel: 'after renovation',
    priceMultiplier: 1.35,
    includes: [
      'Fine dust removal (walls, ceilings, tracks)',
      'Paint & adhesive spot removal',
      'Debris collection & proper disposal',
      'Deep floor & tile scrubbing',
      'Window & frame detailing',
      'Fixture polishing',
    ],
    bestFor: 'Newly built or renovated condos, houses, and commercial fit-outs.',
  },
  {
    id: 'move-inout',
    name: 'Move-In / Move-Out Cleaning',
    short: 'Get your deposit back. Start fresh.',
    description:
      'An empty-unit deep clean designed for tenants and owners: every corner, cabinet, and appliance interior so the next chapter starts spotless.',
    image: '/images/svc-move.png',
    startingPrice: 1399,
    startingLabel: 'empty units',
    priceMultiplier: 1.25,
    includes: [
      'Inside all cabinets, closets & drawers',
      'Appliance interiors (ref, oven upon request)',
      'Wall spot-cleaning & cobweb removal',
      'Bathroom & kitchen full disinfection',
      'Floors deep scrubbed & polished',
      'Balcony & utility areas',
    ],
    bestFor: 'End-of-lease handovers, new homeowners, and property managers.',
  },
  {
    id: 'carpet',
    name: 'Carpet Deep Cleaning',
    short: 'Stains out. Fibers revived.',
    description:
      'Hot-water extraction deep cleaning that lifts years of dirt, dust mites, and stubborn stains from carpets, rugs, and upholstered furniture.',
    image: '/images/svc-carpet.png',
    startingPrice: 800,
    startingLabel: 'per room',
    priceMultiplier: 1,
    includes: [
      'Pre-treatment of stains & spots',
      'Hot-water extraction (steam) cleaning',
      'Deodorizing & freshening',
      'Dust mite & allergen reduction',
      'Fast-dry technique',
      'Upholstery add-on available',
    ],
    bestFor: 'Homes with kids/pets, offices with carpeted areas, allergy sufferers.',
  },
  {
    id: 'maintenance',
    name: 'Regular Maintenance Cleaning',
    short: 'Stay clean on a schedule. Save more.',
    description:
      'Recurring weekly, bi-weekly, or monthly visits that keep your space consistently fresh — with the same trusted team and a loyalty perk on your 5th booking.',
    image: '/images/svc-maintenance.png',
    startingPrice: 999,
    startingLabel: 'per visit',
    priceMultiplier: 0.95,
    includes: [
      'Everything in General Cleaning (tuned to your needs)',
      'Same-day, same team scheduling',
      'Your preferences saved (products, priorities, pets)',
      'Loyalty: book 5, get the 6th at 50% off',
      'Priority slots for subscribers',
      'Flexible pause & reschedule',
    ],
    bestFor: 'Busy households, offices, Airbnb hosts, and pet owners.',
  },
]

/* --------------------------------- Pricing ----------------------------------- */

export interface SizeTier {
  id: string
  label: string
  min: number
  max: number
  base: number
  note?: string
}

export const SIZE_TIERS: SizeTier[] = [
  { id: 'studio', label: 'Studio / up to 15 sqm', min: 1, max: 15, base: 800, note: 'Condo studio or single room' },
  { id: 'small', label: '15–30 sqm', min: 16, max: 30, base: 1099, note: '1–2 bedroom condo — our flagship rate' },
  { id: 'medium', label: '31–50 sqm', min: 31, max: 50, base: 1699, note: '2–3 bedroom home' },
  { id: 'large', label: '51–80 sqm', min: 51, max: 80, base: 2499, note: '3–4 bedroom house' },
  { id: 'xl', label: '81–120 sqm', min: 81, max: 120, base: 3499, note: 'Large house or small office' },
  { id: 'custom', label: '121+ sqm', min: 121, max: 9999, base: 0, note: 'Custom quote — free ocular estimate' },
]

export const CARPET_TIERS = [
  { rooms: 1, label: '1 room / area', price: 800 },
  { rooms: 2, label: '2 rooms', price: 1400 },
  { rooms: 3, label: '3 rooms', price: 1900 },
  { rooms: 4, label: '4+ rooms / whole home', price: 2400 },
]

/* ------------------------------- Coverage areas ------------------------------ */

export interface AreaZone {
  id: string
  name: string
  cities: string
  travelFee: string
  eta: string
  color: string
  // schematic SVG map position (0-100 viewBox coordinates)
  x: number
  y: number
  rx: number
  ry: number
}

export const AREA_ZONES: AreaZone[] = [
  {
    id: 'metro-manila',
    name: 'Metro Manila',
    cities: 'All 17 cities — QC, Manila, Makati, Taguig, Pasig, Parañaque, Las Piñas, Muntinlupa & more',
    travelFee: 'FREE',
    eta: 'Same-day & next-day slots usually available',
    color: 'emerald',
    x: 50,
    y: 52,
    rx: 15,
    ry: 11,
  },
  {
    id: 'rizal',
    name: 'Antipolo & Rizal',
    cities: 'Antipolo, Cainta, Taytay, Marikina borders',
    travelFee: 'from ₱100',
    eta: 'Book 1–2 days ahead',
    color: 'amber',
    x: 72,
    y: 47,
    rx: 10,
    ry: 8,
  },
  {
    id: 'cavite',
    name: 'Cavite',
    cities: 'Bacoor, Imus, Dasmariñas, Kawit',
    travelFee: 'from ₱150',
    eta: 'Book 2 days ahead',
    color: 'teal',
    x: 30,
    y: 76,
    rx: 11,
    ry: 8,
  },
  {
    id: 'laguna',
    name: 'Laguna',
    cities: 'Santa Rosa, Biñan, Cabuyao, Calamba',
    travelFee: 'from ₱150',
    eta: 'Book 2–3 days ahead',
    color: 'lime',
    x: 52,
    y: 88,
    rx: 12,
    ry: 7,
  },
  {
    id: 'bulacan',
    name: 'Bulacan',
    cities: 'Meycauayan, Marilao, Bocaue, Malolos',
    travelFee: 'from ₱150',
    eta: 'Book 2 days ahead',
    color: 'orange',
    x: 47,
    y: 22,
    rx: 13,
    ry: 8,
  },
  {
    id: 'tagaytay',
    name: 'Tagaytay',
    cities: 'Tagaytay City & nearby ridge areas',
    travelFee: 'from ₱200',
    eta: 'Book 3 days ahead',
    color: 'rose',
    x: 22,
    y: 94,
    rx: 9,
    ry: 6,
  },
]

/* ------------------------------ Before / After ------------------------------- */

export interface Transformation {
  id: string
  title: string
  category: ServiceId
  categoryLabel: string
  before: string
  after: string
  story: string
  client: string
}

export const TRANSFORMATIONS: Transformation[] = [
  {
    id: 'living-room',
    title: 'Family living room, 4 years of build-up',
    category: 'general',
    categoryLabel: 'Intensive General',
    before: '/images/before-living.png',
    after: '/images/after-living.png',
    story:
      'A 28 sqm condo in Quezon City that hadn\'t had a deep clean in years. Four hours later: degreased kitchen, sanitized bathroom, and floors you can eat off.',
    client: 'Marites D. — Quezon City',
  },
  {
    id: 'renovated-kitchen',
    title: 'Post-renovation kitchen, cement dust everywhere',
    category: 'post-construction',
    categoryLabel: 'Post-Construction',
    before: '/images/before-kitchen.png',
    after: '/images/after-kitchen.png',
    story:
      'Contractors left fine dust on every surface of this newly renovated kitchen. One intensive post-construction session made it genuinely move-in ready.',
    client: 'Paolo & Rizza R. — Pasig City',
  },
  {
    id: 'bedroom-carpet',
    title: 'Bedroom carpet with "permanent" coffee stains',
    category: 'carpet',
    categoryLabel: 'Carpet Deep Clean',
    before: '/images/before-carpet.png',
    after: '/images/after-carpet.png',
    story:
      'Eight years of spills and pet accidents. Hot-water extraction lifted stains the owner had given up on — the carpet came back to life for a fraction of replacement cost.',
    client: 'Andrea M. — Makati City',
  },
]

/* --------------------------------- The team ---------------------------------- */

export interface TeamMember {
  name: string
  role: string
  years: string
  image: string
  bio: string
  skills: string[]
}

export const TEAM: TeamMember[] = [
  {
    name: 'Maria "Ate Mareng" Santos',
    role: 'Team Lead — General Deep Cleaning',
    years: '6 yrs with CozyCare',
    image: '/images/team-1.png',
    bio: 'Leads our busiest crews and trains every new hire on our 42-point checklist. Known for kitchen transformations clients call "magic".',
    skills: ['42-Point Checklist Certified', 'Food-safe sanitization', 'Team trainer'],
  },
  {
    name: 'Jose "Kuya Osang" Reyes',
    role: 'Post-Construction Specialist',
    years: '5 yrs with CozyCare',
    image: '/images/team-2.png',
    bio: 'The one we call for the toughest jobs — cement dust, paint splatter, debris. If a renovation site can be revived, Kuya Osang has done it.',
    skills: ['Fine-dust extraction', 'Paint & adhesive removal', 'Safety-trained'],
  },
  {
    name: 'Jen & Marco Mendoza',
    role: 'Carpet & Upholstery Experts',
    years: '4 yrs with CozyCare',
    image: '/images/team-3.png',
    bio: 'Our husband-and-wife carpet rescue duo. They\'ve lifted stains other services called "permanent" — and they bring the machine that proves it.',
    skills: ['Hot-water extraction', 'Stain identification', 'Pet-odor treatment'],
  },
]

/* ----------------------------------- FAQs ------------------------------------ */

export interface Faq {
  q: string
  a: string
}

export const FAQS: Faq[] = [
  {
    q: 'How much does a deep cleaning cost?',
    a: 'Pricing starts at ₱800 for studios and single rooms, and ₱1,099 covers 15–30 sqm — our flagship rate. Larger homes are priced in tiers (31–50 sqm from ₱1,699, 51–80 sqm from ₱2,499). Use our instant calculator above for a real estimate in seconds — no hidden fees.',
  },
  {
    q: 'What areas do you cover?',
    a: 'All of Metro Manila is our home turf with FREE travel. We also serve Antipolo & Rizal, Cavite, Laguna, Bulacan, and Tagaytay for a small travel fee (from ₱100–₱200 depending on location).',
  },
  {
    q: 'What\'s included in the ₱1,099 package?',
    a: 'The full 42-point deep clean: dusting all surfaces, kitchen degreasing, bathroom scrub & disinfection, floor scrubbing and mopping, window interiors, and more. See the complete list in the Services section.',
  },
  {
    q: 'Do you bring your own cleaning supplies?',
    a: 'Yes! Our teams arrive fully equipped with professional-grade tools and products. If you prefer specific products (hypoallergenic, pet-safe, or your own supplies), just tell us when booking — we save your preferences for future visits.',
  },
  {
    q: 'Are you really open every day?',
    a: 'Yes — CozyCare operates 7 days a week, 8:00 AM to 6:00 PM, including weekends and most holidays. Same-day slots for Metro Manila are often available; message us to check.',
  },
  {
    q: 'How do I pay?',
    a: 'We accept GCash, Maya, bank transfer, and cash on-site. Full payment details are confirmed when we confirm your booking via SMS or Messenger.',
  },
  {
    q: 'What if I need to reschedule?',
    a: 'Life happens! Just message us at least 12 hours before your slot and we\'ll rebook you at no charge. Loyal maintenance customers get priority rescheduling.',
  },
]

/* --------------------------------- Blog hub ---------------------------------- */

export interface Article {
  id: string
  title: string
  category: string
  minutes: number
  excerpt: string
  image: string
  content: string[]
}

export const ARTICLES: Article[] = [
  {
    id: 'carpet-signs',
    title: '5 Signs Your Carpet Needs Professional Cleaning',
    category: 'Carpet Care',
    minutes: 4,
    image: '/images/svc-carpet.png',
    excerpt:
      'Vacuuming alone can\'t pull out what\'s buried deep in carpet fibers. Here\'s how to know it\'s time to call in the extraction machine.',
    content: [
      'Your carpet works silently every day — trapping dust, skin cells, pet dander, and allergens that vacuuming simply can\'t reach. Here are the five telltale signs it\'s time for a professional hot-water extraction clean.',
      '**1. Stubborn stains keep coming back.** If a stain "reappears" days after you scrubbed it, the spill seeped past the fibers into the carpet backing. DIY spot cleaners only treat the surface — extraction pulls the residue out from below.',
      '**2. A musty or sour smell that won\'t go.** Odors mean bacteria and moisture deep in the pile — common in Filipino homes during rainy season. Deodorizer sprays mask it for a day; deep cleaning removes the source.',
      '**3. Your allergies act up at home.** Dust mites and allergens accumulate in carpet fibers. If sneezing fits are worst in carpeted rooms, professional cleaning (which kills and extracts dust mites) can make a noticeable difference within days.',
      '**4. Visible traffic lanes.** Dark paths where people walk mean compacted soil that brushing spreads around instead of removing. Extraction lifts the fibers and the grime out entirely.',
      '**5. It\'s been over 12 months.** Even a carpet that looks clean can hold kilos of dry soil. Industry rule of thumb: professional deep clean every 12 months — every 6 months with kids or pets.',
      '**The good news:** carpet deep cleaning starts at just ₱800 per room at CozyCare PH — a fraction of the cost of replacing a carpet. Book online in under a minute, available every day of the week.',
    ],
  },
  {
    id: 'move-in-checklist',
    title: 'Move-In Cleaning Checklist: Start Fresh in Your New Home',
    category: 'Moving Guide',
    minutes: 5,
    image: '/images/svc-move.png',
    excerpt:
      'The previous tenants cleaned... sort of. Before your boxes arrive, work through this room-by-room checklist — or hand it to us.',
    content: [
      'Nothing kills the excitement of a new home like discovering the previous occupant\'s grime in the kitchen cabinet. Deep clean BEFORE your boxes arrive — it\'s ten times easier in an empty unit.',
      '**Kitchen first (the biggest job):** wipe cabinet interiors and tops, degrease the stove and hood, clean the fridge interior with baking soda solution, scrub the sink and faucet base, degrease tile backsplash, and mop under where appliances stood.',
      '**Bathrooms:** descale the shower head and glass, scrub grout lines, disinfect the toilet bowl base and behind it, clean exhaust fan grills, and polish mirrors and fixtures.',
      '**Every room:** wipe walls for scuff marks and cobwebs, clean window tracks and interiors, wipe door tops and frames (dust heaven), dust light fixtures and fan blades, vacuum closets inside-out, and mop corners where the vacuum can\'t reach.',
      '**Forgotten spots people always miss:** the tops of doors, switch plates, inside drawers, balcony drains, and the washing machine drum and filter.',
      '**Short on time?** Our Move-In/Move-Out package covers all of the above — including cabinets, appliances, and those forgotten spots — in one visit. Clients book it precisely to get full deposits back on the way out, or a genuinely fresh start on the way in. Available 7 days a week, from ₱1,399.',
    ],
  },
  {
    id: 'between-visits',
    title: 'How to Keep Your Home Fresh Between Deep Clean Visits',
    category: 'Home Care',
    minutes: 3,
    image: '/images/svc-maintenance.png',
    excerpt:
      'Your deep clean doesn\'t have to fade in a week. These 10-minute daily habits stretch that "fresh home" feeling for weeks.',
    content: [
      'A professional deep clean resets your home to zero. Here\'s how our repeat clients keep that fresh feeling until the next visit — none of it takes more than 10 minutes a day.',
      '**The 10-minute nightly reset:** set a timer, put things back where they belong, wipe the dining table and kitchen counters, and sweep the kitchen floor. Small effort, compounding results.',
      '**The one-minute shoe rule:** shoes off at the door. Most floor dirt comes in on soles — this single habit cuts your floor grime by more than half.',
      '**Weekly 15-minute bathroom wipe:** a quick scrub of the toilet, sink, and shower glass on Sunday keeps the deep-cleaned grout from rebuilding soap scum.',
      '**Handle humidity:** during rainy months, run the exhaust fan after showers and wipe windowsills. Moisture is what turns a clean bathroom into a smelly one.',
      '**Oil discipline in the kitchen:** wipe the stove after every cooking session while it\'s still warm. Grease that sits for a week is what makes kitchen deep cleans take hours.',
      '**Or skip the maintenance entirely:** our Regular Maintenance Cleaning plan sends the same trusted team on a weekly, bi-weekly, or monthly schedule — with preferences saved, priority slots, and every 6th visit at 50% off. It\'s the set-it-and-forget-it way to stay cozy.',
    ],
  },
]

/* ----------------------------- Chat: quick replies ---------------------------- */

export const CHAT_QUICK_REPLIES = [
  'How much for a 25 sqm condo?',
  'What areas do you cover?',
  'What\'s included in deep cleaning?',
  'Are you open on weekends?',
]
