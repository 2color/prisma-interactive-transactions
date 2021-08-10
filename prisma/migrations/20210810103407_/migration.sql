-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screening" (
    "id" SERIAL NOT NULL,
    "imdbId" TEXT NOT NULL,
    "movieName" TEXT NOT NULL,
    "movieYear" DATE NOT NULL,
    "synopsis" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "ticketLimit" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "paymentConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "screeningId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Screening.imdbId_unique" ON "Screening"("imdbId");

-- AddForeignKey
ALTER TABLE "Booking" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD FOREIGN KEY ("screeningId") REFERENCES "Screening"("id") ON DELETE CASCADE ON UPDATE CASCADE;
