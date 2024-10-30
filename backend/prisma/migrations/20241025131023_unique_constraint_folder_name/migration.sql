/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Folder_title_key" ON "Folder"("title");
