import { PipeTransform, ArgumentMetadata } from '@nestjs/common';

export class NumericalDefault implements PipeTransform {
  constructor(private readonly options: { min: boolean; default: number }) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (this.options.min) {
      return Math.min(this.options.default, value || this.options.default);
    }
    return Math.max(this.options.default, value || this.options.default);
  }
}
