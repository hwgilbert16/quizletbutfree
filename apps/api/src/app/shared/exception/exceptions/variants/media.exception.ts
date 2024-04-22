import { HttpStatus } from "@nestjs/common";
import { ExceptionVariant } from "../../annotations/exception-variant.decorator";
import { Variant } from "../../interfaces/variant.interface";

export class MediaException {
  @ExceptionVariant(
    "Media not found.",
    "The file specified does not exist.",
    HttpStatus.BAD_REQUEST
  )
  public static readonly MediaNotFound: Variant;

  @ExceptionVariant(
    "Media not provided.",
    "Please, provide a file.",
    HttpStatus.BAD_REQUEST
  )
  public static readonly MediaNotProvided: Variant;
}
