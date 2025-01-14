import { Controller, Get, Query } from '@nestjs/common';
import { LiteralTranslationService } from './literal-translation.service';

@Controller('api/v1/literal-translation')
export class LiteralTranslationController {
  constructor(
    private readonly literalTranslationService: LiteralTranslationService,
  ) {}

  @Get()
  fromArabicLettersToHieroglyphics(@Query('text') text: string): string {
    return this.literalTranslationService.fromArabicLettersToHieroglyphics(
      text,
    );
  }
}
