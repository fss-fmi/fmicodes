/*
  Warnings:

  - You are about to drop the column `mentorId` on the `mentor_links` table. All the data in the column will be lost.
  - You are about to drop the column `mentor_id` on the `teams` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "mentor_links" DROP CONSTRAINT "mentor_links_mentorId_fkey";

-- AlterTable
ALTER TABLE "mentor_links" DROP COLUMN "mentorId";

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "mentor_id";
