/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Curriculo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Curriculo_email_key` ON `curriculo`;

-- CreateIndex
CREATE UNIQUE INDEX `Curriculo_id_key` ON `Curriculo`(`id`);
