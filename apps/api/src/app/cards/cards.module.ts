import { forwardRef, Module } from "@nestjs/common";
import { DatabaseModule } from "../providers/database/database.module";
import { CardsController } from "./cards.controller";
import { CardsService } from "./cards.service";
import { SetsModule } from "../sets/sets.module";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";
import { StorageModule } from "../providers/storage/storage.module";
import { SpacedRepetitionModule } from "../spaced-repetition/spaced-repetition.module";

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    forwardRef(() => SetsModule),
    AuthModule,
    StorageModule,
    forwardRef(() => SpacedRepetitionModule)
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService]
})
export class CardsModule {}
