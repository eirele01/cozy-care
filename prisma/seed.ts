import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const testimonials = [
  {
    name: 'Marites D.',
    location: 'Quezon City',
    rating: 5,
    service: 'Intensive General Cleaning',
    quote:
      'Grabe, sobrang linis! The team arrived on time, worked quietly for 4 hours, and my kitchen looked brand new. Worth every peso of the ₱1,099.',
    featured: true,
  },
  {
    name: ' Paolo &izza R.',
    location: 'Pasig City',
    rating: 5,
    service: 'Post-Construction Cleaning',
    quote:
      'After our condo renovation, ang daming cement dust everywhere. CozyCare made it move-in ready in one day. Ang galing nila sa details — even the window tracks!',
    featured: true,
  },
  {
    name: 'Andrea M.',
    location: 'Makati City',
    rating: 5,
    service: 'Carpet Deep Cleaning',
    quote:
      'My 8-year-old carpet had coffee stains I thought were permanent. They steam cleaned it and the stains are GONE. It smells fresh again. Booking again next quarter.',
    featured: true,
  },
  {
    name: 'Engr. Ramon T.',
    location: 'Antipolo, Rizal',
    rating: 5,
    service: 'Move-In/Move-Out Cleaning',
    quote:
      'We booked them for our move-out cleaning so we could get our full deposit back. The landlord was impressed! They even traveled to Antipolo without any hassle.',
    featured: true,
  },
  {
    name: 'Lorna B.',
    location: 'Las Piñas City',
    rating: 5,
    service: 'Intensive General Cleaning',
    quote:
      'Booking was so easy — I messaged them on Facebook at night and got confirmed the next morning. The cleaners were polite, kusang pinunasan nila lahat ng sulok.',
    featured: true,
  },
  {
    name: 'Jayson & Family',
    location: 'Bacoor, Cavite',
    rating: 5,
    service: 'Regular Maintenance Cleaning',
    quote:
      'Every two weeks silang bumibisita sa amin. Consistent ang quality every single time. It honestly changed how our home feels — less stress for the whole family.',
    featured: true,
  },
]

async function main() {
  console.log('Seeding database...')

  await prisma.testimonial.deleteMany({})
  await prisma.testimonial.createMany({ data: testimonials })

  const count = await prisma.testimonial.count()
  console.log(`Seeded ${count} testimonials. Done.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
