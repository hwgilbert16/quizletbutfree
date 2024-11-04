/*
  Warnings:

  - You are about to drop the column `easeFactor` on the `SpacedRepetitionCard` table. All the data in the column will be lost.
  - You are about to drop the column `lastStudiedAt` on the `SpacedRepetitionCard` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `SpacedRepetitionCardReview` table. All the data in the column will be lost.
  - You are about to drop the column `quality` on the `SpacedRepetitionCardReview` table. All the data in the column will be lost.
  - You are about to drop the column `cardsPerDay` on the `SpacedRepetitionSet` table. All the data in the column will be lost.
  - Added the required column `daysBetweenLastTwoReviews` to the `SpacedRepetitionCardReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daysSinceLastReview` to the `SpacedRepetitionCardReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daysUntilNextReview` to the `SpacedRepetitionCardReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previousDifficulty` to the `SpacedRepetitionCardReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previousDue` to the `SpacedRepetitionCardReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previousStability` to the `SpacedRepetitionCardReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `SpacedRepetitionCardReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `SpacedRepetitionCardReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desiredRetention` to the `SpacedRepetitionSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maximumInterval` to the `SpacedRepetitionSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `w` to the `SpacedRepetitionSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SpacedRepetitionCard` DROP COLUMN `easeFactor`,
    DROP COLUMN `lastStudiedAt`,
    ADD COLUMN `difficulty` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `lapses` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `lastReviewed` DATETIME(3) NOT NULL DEFAULT '1970-01-01T00:00:01+00:00',
    ADD COLUMN `stability` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `state` ENUM('NEW', 'LEARNING', 'REVIEW', 'RELEARNING') NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE `SpacedRepetitionCardReview` DROP COLUMN `correct`,
    DROP COLUMN `quality`,
    ADD COLUMN `daysBetweenLastTwoReviews` INTEGER NOT NULL,
    ADD COLUMN `daysSinceLastReview` INTEGER NOT NULL,
    ADD COLUMN `daysUntilNextReview` INTEGER NOT NULL,
    ADD COLUMN `previousDifficulty` DOUBLE NOT NULL,
    ADD COLUMN `previousDue` DATETIME(3) NOT NULL,
    ADD COLUMN `previousStability` DOUBLE NOT NULL,
    ADD COLUMN `rating` ENUM('MANUAL', 'AGAIN', 'HARD', 'GOOD', 'EASY') NOT NULL,
    ADD COLUMN `state` ENUM('NEW', 'LEARNING', 'REVIEW', 'RELEARNING') NOT NULL;

-- AlterTable
ALTER TABLE `SpacedRepetitionSet` DROP COLUMN `cardsPerDay`,
    ADD COLUMN `desiredRetention` DOUBLE NOT NULL,
    ADD COLUMN `maximumInterval` INTEGER NOT NULL,
    ADD COLUMN `w` JSON NOT NULL;
