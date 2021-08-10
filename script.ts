import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
  const booking1 = await createBooking('nilu@prisma.io', '9606374')
  console.log(booking1)
  const booking2 = await createBooking('etel@prisma.io', '9606374')
  console.log(booking2)
  const booking3 = await createBooking('daniel@prisma.io', '9606374')
  console.log(booking3)
}

async function createBooking(email: string, imdbId: string) {
  // Transaction to book a ticket if there's seats available
  return await prisma.$transaction(async (prisma) => {
    const screening = await prisma.screening.findUnique({
      where: {
        imdbId,
      },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    })
    if (screening === null) {
      throw new Error('screening not found')
    }

    if (
      screening._count &&
      screening._count.bookings >= screening.ticketLimit
    ) {
      throw new Error('Screening booked out')
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        screening: {
          connect: {
            id: screening.id,
          },
        },
        user: {
          connect: {
            email,
          },
        },
      },
      include: {
        screening: {
          // Create the booking
          select: {
            movieName: true,
            imdbId: true,
          },
        },
      },
    })

    const notification = await prisma.notification.create({
      data: {
        message: `Your booking for ${booking.screening.movieName} is confirmed. Booking id: ${booking.id}}`,
        user: {
          connect: {
            email: email,
          },
        },
      },
    })

    return [booking, notification]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
