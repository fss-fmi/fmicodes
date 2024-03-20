/*
  Warnings:

  - A unique constraint covering the columns `[team_points_id]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "team_points_id" INTEGER;

-- CreateTable
CREATE TABLE "team_points" (
    "id" SERIAL NOT NULL,
    "relevance" INTEGER NOT NULL,
    "originality" INTEGER NOT NULL,
    "applicability" INTEGER NOT NULL,
    "completion" INTEGER NOT NULL,
    "complexity" INTEGER NOT NULL,
    "authenticity" INTEGER NOT NULL,
    "quality" INTEGER NOT NULL,
    "projectTechnologiesChoice" INTEGER NOT NULL,
    "projectStructure" INTEGER NOT NULL,
    "presentation" INTEGER NOT NULL,
    "demo" INTEGER NOT NULL,
    "questions" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "team_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_points_id_key" ON "teams"("team_points_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_team_points_id_fkey" FOREIGN KEY ("team_points_id") REFERENCES "team_points"("id") ON DELETE SET NULL ON UPDATE CASCADE;
