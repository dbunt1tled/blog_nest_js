/*
  Warnings:

  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_authorId_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` VARCHAR(100) NOT NULL,
    MODIFY `name` VARCHAR(200) NOT NULL;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
