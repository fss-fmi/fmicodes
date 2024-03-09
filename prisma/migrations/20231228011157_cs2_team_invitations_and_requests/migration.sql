-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_capitan_id_fkey";

-- CreateTable
CREATE TABLE "team_invitations" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_requests" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_capitan_id_fkey" FOREIGN KEY ("capitan_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_requests" ADD CONSTRAINT "team_requests_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_requests" ADD CONSTRAINT "team_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
