import { HttpStatus } from '@nestjs/common';
import { ExceptionVariant } from '../../annotations/exception-variant.decorator';
import { Variant } from '../../interfaces/variant.interface';

export class UserException {
  @ExceptionVariant(
    'User does not exist.',
    'User with this identifier does not exist.',
    HttpStatus.BAD_REQUEST
  )
  public static readonly UserDoesNotExist: Variant;
}
