import { Module } from "@nestjs/common";
import { SpacedRepetitionService } from "./spaced-repetition.service";
import { SpacedRepetitionController } from "./spaced-repetition.controller";
import { SpacedRepetitionSetsService } from "./spaced-repetition-sets.service";
import { SpacedRepetitionCardsService } from "./spaced-repetition-cards.service";
import { DatabaseModule } from "../providers/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [SpacedRepetitionController],
  providers: [
    SpacedRepetitionService,
    SpacedRepetitionSetsService,
    SpacedRepetitionCardsService
  ]
})
export class SpacedRepetitionModule {}
