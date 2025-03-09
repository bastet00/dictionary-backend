import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { SanitizeSpecialCharsPipe } from 'src/common/custom-pipes/sanitizeSymbolPipe';
import { LanguageEnum } from 'src/dto/language.enum';

@Controller('api/v1/translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}
  @Get()
  translate(
    @Query('word', new SanitizeSpecialCharsPipe()) text: string,
    @Query('lang', new ParseEnumPipe(LanguageEnum)) language: LanguageEnum,
  ) {
    return this.translationService.translate(language, text);
  }
}
