import { Module } from "@nestjs/common";
import { SpacedRepetitionService } from "./spaced-repetition.service";
import { SpacedRepetitionSetsService } from "./spaced-repetition-sets.service";
import { SpacedRepetitionCardsService } from "./spaced-repetition-cards.service";
import { DatabaseModule } from "../providers/database/database.module";
import { SpacedRepetitionSetsController } from "./spaced-repetition-sets.controller";
import { SpacedRepetitionCardsController } from "./spaced-repetition-cards.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    DatabaseModule,
    AuthModule
  ],
  controllers: [
    SpacedRepetitionSetsController,
    SpacedRepetitionCardsController
  ],
  providers: [
    SpacedRepetitionService,
    SpacedRepetitionSetsService,
    SpacedRepetitionCardsService
  ]
})
export class SpacedRepetitionModule {}
