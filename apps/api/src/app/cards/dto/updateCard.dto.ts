import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import * as sanitizeHtml from "sanitize-html";
import { sanitizationConfig } from "../../shared/sanitization/sanitization-config";

export class UpdateCardDto {
  @ApiProperty({
    description: "The index of the card in the set",
    example: 0,
    required: false,
    minimum: 0,
    maximum: 2147483647,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(2147483647)
  @IsNotEmpty()
  index?: number;

  @ApiProperty({
    description: 'The front or "term" of the card',
    example: "The definition of the card",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) =>
    sanitizeHtml(params.value, sanitizationConfig)
  )
  term?: string;

  @ApiProperty({
    description: 'The back or "definition" of the card',
    example: "The definition of the card",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) =>
    sanitizeHtml(params.value, sanitizationConfig)
  )
  definition?: string;
}
