-- AlterTable
ALTER TABLE `SpacedRepetitionSet` ALTER COLUMN `cardsPerDay` DROP DEFAULT;

-- CreateTable
CREATE TABLE `SpacedRepetitionCardReview` (
    `id` VARCHAR(191) NOT NULL,
    `spacedRepetitionCardId` VARCHAR(191) NOT NULL,
    `recallTime` INTEGER NOT NULL,
    `correct` BOOLEAN NOT NULL,
    `quality` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SpacedRepetitionCardReview_spacedRepetitionCardId_idx`(`spacedRepetitionCardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
