-- AlterTable
ALTER TABLE `LeitnerSet` ADD COLUMN `answerWith` ENUM('TERM', 'DEFINITION') NOT NULL DEFAULT 'TERM';
