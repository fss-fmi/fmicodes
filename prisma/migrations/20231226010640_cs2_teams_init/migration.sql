-- CreateEnum
CREATE TYPE "colors" AS ENUM ('RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE', 'PINK', 'BROWN', 'NAVY', 'VIOLET', 'CYAN', 'MAGENTA', 'LIME', 'TEAL', 'INDIGO', 'CORAL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "team_id" INTEGER;

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" "colors" NOT NULL,
    "capitan_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);


-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teams_capitan_id_key" ON "teams"("capitan_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_capitan_id_fkey" FOREIGN KEY ("capitan_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
