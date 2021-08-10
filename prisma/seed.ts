import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
  },
  {
    name: 'Daniel',
    email: 'daniel@prisma.io',
  },
  {
    name: 'Etel',
    email: 'etel@prisma.io',
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
  },
]

const screeningData: Prisma.ScreeningCreateInput[] = [
  {
    movieName: 'Sound of Metal',
    imdbId: '5363618',
    movieYear: new Date(2019, 0),
    startTime: new Date(2021, 7, 20, 20, 0),
    ticketLimit: 3,
  },
  {
    movieName: 'On the Rocks',
    imdbId: '9606374',
    movieYear: new Date(2020, 0),
    startTime: new Date(2021, 7, 21, 20, 0),
    ticketLimit: 2,
  },
]

async function main() {
  console.log(`Start seeding ...`)
  const users = await prisma.user.createMany({
    data: userData,
  })
  console.log(users)

  const screenings = await prisma.screening.createMany({
    data: screeningData,
  })

  console.log(screenings)
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
