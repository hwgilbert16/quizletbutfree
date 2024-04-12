import { Module } from "@nestjs/common";
import { SpacedRepetitionService } from "./spaced-repetition.service";
import { SpacedRepetitionController } from "./spaced-repetition.controller";

@Module({
  imports: [],
  controllers: [SpacedRepetitionController],
  providers: [SpacedRepetitionService]
})
export class SpacedRepetitionModule {}
