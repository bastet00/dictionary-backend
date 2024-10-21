import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SanitizeSpecialCharsPipe implements PipeTransform {
  transform(value: string) {
    if (value) {
      // @Returns: chars and numbers ( include unicode for arabic chars )
      return value.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '');
    }

    throw new BadRequestException('word was not provided');
  }
}
