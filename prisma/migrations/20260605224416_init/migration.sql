-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED');

-- CreateEnum
CREATE TYPE "YesNoMaybe" AS ENUM ('YES', 'NO', 'MAYBE');

-- CreateEnum
CREATE TYPE "FamilyType" AS ENUM ('NUCLEAR', 'JOINT');

-- CreateEnum
CREATE TYPE "DietaryPreference" AS ENUM ('VEG', 'NON_VEG', 'JAIN', 'EGGETARIAN');

-- CreateEnum
CREATE TYPE "DrinkingStatus" AS ENUM ('YES', 'NO', 'OCCASIONALLY');

-- CreateEnum
CREATE TYPE "SmokingStatus" AS ENUM ('YES', 'NO', 'OCCASIONALLY');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ONBOARDED', 'ACTIVE', 'MATCH_SENT', 'MUTUAL_INTEREST', 'MEETING_SCHEDULED', 'CLOSED_WON', 'CLOSED_LOST');

-- CreateEnum
CREATE TYPE "AILabel" AS ENUM ('DREAM', 'HIGH', 'COMPATIBLE', 'LOW');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SENT', 'INTERESTED', 'NOT_INTERESTED', 'MEETING_SCHEDULED');

-- CreateTable
CREATE TABLE "Matchmaker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'matchmaker',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Matchmaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "undergradCollege" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "income" INTEGER NOT NULL,
    "currentCompany" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "languagesKnown" TEXT[],
    "siblings" INTEGER NOT NULL,
    "caste" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "wantKids" "YesNoMaybe" NOT NULL,
    "openToRelocate" "YesNoMaybe" NOT NULL,
    "openToPets" "YesNoMaybe" NOT NULL,
    "familyType" "FamilyType" NOT NULL,
    "motherTongue" TEXT NOT NULL,
    "dietaryPreference" "DietaryPreference" NOT NULL,
    "drinking" "DrinkingStatus" NOT NULL,
    "smoking" "SmokingStatus" NOT NULL,
    "horoscopeRequired" BOOLEAN NOT NULL,
    "nriStatus" BOOLEAN NOT NULL,
    "photoUrl" TEXT,
    "bio" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignedMatchmakerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "matchedWithId" TEXT NOT NULL,
    "aiScore" INTEGER NOT NULL,
    "aiLabel" "AILabel" NOT NULL,
    "aiExplanation" TEXT NOT NULL,
    "aiIntroEmail" TEXT,
    "status" "MatchStatus" NOT NULL DEFAULT 'SENT',
    "magicToken" TEXT,
    "magicTokenExpiresAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "matchmakerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Matchmaker_email_key" ON "Matchmaker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_assignedMatchmakerId_idx" ON "Client"("assignedMatchmakerId");

-- CreateIndex
CREATE INDEX "Client_status_idx" ON "Client"("status");

-- CreateIndex
CREATE INDEX "Client_gender_idx" ON "Client"("gender");

-- CreateIndex
CREATE UNIQUE INDEX "Match_magicToken_key" ON "Match"("magicToken");

-- CreateIndex
CREATE INDEX "Match_clientId_idx" ON "Match"("clientId");

-- CreateIndex
CREATE INDEX "Match_matchedWithId_idx" ON "Match"("matchedWithId");

-- CreateIndex
CREATE INDEX "Match_magicToken_idx" ON "Match"("magicToken");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE INDEX "Note_clientId_idx" ON "Note"("clientId");

-- CreateIndex
CREATE INDEX "Note_matchmakerId_idx" ON "Note"("matchmakerId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_assignedMatchmakerId_fkey" FOREIGN KEY ("assignedMatchmakerId") REFERENCES "Matchmaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_matchedWithId_fkey" FOREIGN KEY ("matchedWithId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_matchmakerId_fkey" FOREIGN KEY ("matchmakerId") REFERENCES "Matchmaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
