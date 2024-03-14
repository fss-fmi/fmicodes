/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `sponsors` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "mentor_id" INTEGER;

-- CreateTable
CREATE TABLE "mentors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "picture_url" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "job_title" TEXT NOT NULL,
    "availability" TEXT[],
    "team_id" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mentors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technologies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MentorToTechnology" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "mentors_name_key" ON "mentors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "mentors_discord_id_key" ON "mentors"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_name_key" ON "technologies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_MentorToTechnology_AB_unique" ON "_MentorToTechnology"("A", "B");

-- CreateIndex
CREATE INDEX "_MentorToTechnology_B_index" ON "_MentorToTechnology"("B");

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_name_key" ON "sponsors"("name");

-- AddForeignKey
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "sponsors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentorToTechnology" ADD CONSTRAINT "_MentorToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "mentors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentorToTechnology" ADD CONSTRAINT "_MentorToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
