// disable no-unused-vars, we need the enum even though all of its values are explicitly used
/* eslint no-unused-vars: 0 */
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

enum Side {
  TERM = "TERM",
  DEFINITION = "DEFINITION"
}

export class CreateSpacedRepetitionSetDto {
  @ApiProperty({
    description: "The number of cards that will be studied each day"
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
    cardsPerDay: number;

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
