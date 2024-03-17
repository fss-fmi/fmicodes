-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "project_description" TEXT,
ADD COLUMN     "project_name" TEXT,
ADD COLUMN     "project_repositories" TEXT[],
ADD COLUMN     "project_website" TEXT;
