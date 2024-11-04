import { IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Side } from "@prisma/client";

export class UpdateSpacedRepetitionSetDto {
  @ApiProperty({
    description: "The side of the flashcard to answer with - either TERM or DEFINITION",
    example: "TERM",
    required: false,
    enum: Side
  })
  @IsEnum(Side)
  @IsOptional()
    answerWith?: Side;
}
