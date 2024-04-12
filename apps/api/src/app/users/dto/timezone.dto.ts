import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsTimeZone } from "class-validator";

export class TimezoneDto {
  @ApiProperty({
    description: "The timezone of the user",
    example: "America/New York"
  })
  @IsNotEmpty()
  @IsTimeZone()
    timezone: string;
}
