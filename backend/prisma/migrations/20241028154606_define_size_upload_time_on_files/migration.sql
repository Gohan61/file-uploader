-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "size" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "uploadTime" INTEGER NOT NULL DEFAULT 0;