import { HttpStatus } from '@nestjs/common';
import { ExceptionVariant } from '../../annotations/exception-variant.decorator';
import { Variant } from '../../interfaces/variant.interface';

export class SetException {
  @ExceptionVariant(
    'Set does not exist.',
    'Set with this identifier does not exist.',
    HttpStatus.BAD_REQUEST
  )
  public static readonly SetDoesNotExist: Variant;

  @ExceptionVariant(
    'This set is private.',
    'This set can only be accessed by its owner.',
    HttpStatus.FORBIDDEN
  )
  public static readonly SetIsPrivate: Variant;

  @ExceptionVariant(
    'Set cannot be modified.',
    'This set can only be modified by its owner.',
    HttpStatus.FORBIDDEN
  )
  public static readonly SetCannotBeModified: Variant;
}
