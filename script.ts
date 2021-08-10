import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
  const bookings = await Promise.allSettled([
    createBooking('nilu@prisma.io', '9606374'),
    createBooking('etel@prisma.io', '9606374'),
    createBooking('daniel@prisma.io', '9606374'),
  ])
  console.dir(bookings)
}

async function createBooking(email: string, imdbId: string) {
  return await prisma.$transaction(async (prisma) => {
    // Question: if a screening is updated at this point by another transaction, will the changes be visible?

    // Transaction to book a ticket if there's seats available
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

    console.log('ticketLimit:\t', screening.ticketLimit)
    console.log('bookings:\t', screening?._count?.bookings)

    if (
      screening._count &&
      screening?._count.bookings >= screening.ticketLimit
    ) {
      throw new Error('Screening booked out')
    }

    return await prisma.booking.create({
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
          select: {
            movieName: true,
            imdbId: true,
          },
        },
      },
    })
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
