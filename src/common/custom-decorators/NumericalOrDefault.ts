import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/*
 * @param options.key => expected url query key
 * @param options.default =>  default value if not provided options.key is not provided
 * @param options.min => take the {min, max} value from {options.key, options.default}
 *
 * @Returns => min or max from {options.key, options.default}
 * */
export const DefaultMinMaxValue = createParamDecorator(
  (
    options: { key: string; default: number; min: boolean },
    ctx: ExecutionContext,
  ): number => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const queryValue = request.query[options.key];

    if (options.min) {
      return Math.min(options.default, +queryValue || options.default);
    }

    return Math.max(options.default, +queryValue || options.default);
  },
);
