import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class RequiredQueryPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('text was not provided');
    }
    return value;
  }
}
