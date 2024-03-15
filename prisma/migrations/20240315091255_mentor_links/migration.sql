-- CreateTable
CREATE TABLE "mentor_links" (
    "id" SERIAL NOT NULL,
    "mentor_a_id" INTEGER NOT NULL,
    "mentor_b_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "mentorId" INTEGER,

    CONSTRAINT "mentor_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mentor_links" ADD CONSTRAINT "mentor_links_mentor_a_id_fkey" FOREIGN KEY ("mentor_a_id") REFERENCES "mentors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_links" ADD CONSTRAINT "mentor_links_mentor_b_id_fkey" FOREIGN KEY ("mentor_b_id") REFERENCES "mentors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_links" ADD CONSTRAINT "mentor_links_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
