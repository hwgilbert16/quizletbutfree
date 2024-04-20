import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class UpdateSpacedRepetitionCardDto {
  @ApiProperty({
    description: "An integer from 0-3 that indicates how easily the information was remembered, with 0 being most difficult",
    example: 3,
    minimum: 0,
    maximum: 5
  })
  @Min(0)
  @Max(5)
  @IsInt()
  @IsNotEmpty()
    quality: number;
}
