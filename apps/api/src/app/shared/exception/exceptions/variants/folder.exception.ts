import { HttpStatus } from '@nestjs/common';
import { ExceptionVariant } from '../../annotations/exception-variant.decorator';
import { Variant } from '../../interfaces/variant.interface';

export class FolderException {
  @ExceptionVariant(
    'Folder does not exist.',
    'Folder with this identifier does not exist.',
    HttpStatus.BAD_REQUEST
  )
  public static readonly FolderDoesNotExist: Variant;

  @ExceptionVariant(
    'User is not author of this folder.',
    'This folder can only be accessed by its owner.',
    HttpStatus.FORBIDDEN
  )
  public static readonly InvalidFolderAuthor: Variant;
}
