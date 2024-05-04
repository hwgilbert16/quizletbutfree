// disable no-unused-vars, we need the enum even though all of its values are explicitly used
/* eslint no-unused-vars: 0 */
import { IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSpacedRepetitionSetDto {
  @ApiProperty({
    description: "The number of cards that will be studied each day"
  })
  @IsNotEmpty()
  @IsInt()
    cardsPerDay: number;
}
