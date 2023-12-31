-- AlterTable
ALTER TABLE `posts` MODIFY `title` VARCHAR(200) NOT NULL,
    MODIFY `content` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1,
    MODIFY `email` VARCHAR(200) NOT NULL,
    MODIFY `name` VARCHAR(200) NULL,
    MODIFY `hash` VARCHAR(200) NOT NULL,
    MODIFY `hashRt` VARCHAR(200) NULL;
