import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SpacedRepetitionCardIdParam {
  @ApiProperty({
    description: "The ID of the spaced repetition card",
    example: "23451829-765a-4b52-9e9e-fe772f0aec55",
    minLength: 36,
    maxLength: 36
  })
  @IsUUID("4")
    spacedRepetitionCardId: string;
}
