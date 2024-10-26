import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SanitizeSpecialCharsPipe implements PipeTransform {
  transform(value: string) {
    if (value) {
      // @Returns: chars, numbers and spaces
      return value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    }

    throw new BadRequestException('word was not provided');
  }
}
