-- AlterTable
ALTER TABLE "_MentorToTechnology" ADD CONSTRAINT "_MentorToTechnology_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_MentorToTechnology_AB_unique";
