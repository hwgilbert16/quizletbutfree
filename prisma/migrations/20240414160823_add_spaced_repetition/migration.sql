-- CreateTable
CREATE TABLE `SpacedRepetitionSet` (
    `id` VARCHAR(191) NOT NULL,
    `setId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cardsPerDay` INTEGER NOT NULL DEFAULT 20,
    `answerWith` ENUM('TERM', 'DEFINITION') NOT NULL DEFAULT 'TERM',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SpacedRepetitionSet_setId_idx`(`setId`),
    INDEX `SpacedRepetitionSet_userId_idx`(`userId`),
    UNIQUE INDEX `SpacedRepetitionSet_setId_userId_key`(`setId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpacedRepetitionCard` (
    `id` VARCHAR(191) NOT NULL,
    `spacedRepetitionSetId` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,
    `easeFactor` DOUBLE NOT NULL DEFAULT 2.5,
    `repetitions` INTEGER NOT NULL DEFAULT 0,
    `due` DATETIME(3) NOT NULL DEFAULT '1970-01-01T00:00:01',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SpacedRepetitionCard_spacedRepetitionSetId_idx`(`spacedRepetitionSetId`),
    UNIQUE INDEX `SpacedRepetitionCard_spacedRepetitionSetId_cardId_key`(`spacedRepetitionSetId`, `cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
