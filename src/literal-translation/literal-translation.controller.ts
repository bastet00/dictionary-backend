import {
  Controller,
  Get,
  ParseBoolPipe,
  ParseEnumPipe,
  Query,
} from '@nestjs/common';
import { LiteralTranslationService } from './literal-translation.service';
import { LiteralTranslationResultsDto } from './dto/literal-translation-results.dto';
import { GenderEnum } from './dto/gender.enum';
import { LiteralTransLanguageEnum } from './dto/language.enum';
import { RequiredQueryPipe } from './dto/text-query.dto';

@Controller(['api/v1/literal-translation', 'literal-translation'])
export class LiteralTranslationController {
  constructor(
    private readonly literalTranslationService: LiteralTranslationService,
  ) {}

  @Get()
  fromArabicLettersToHieroglyphics(
    @Query('text', new RequiredQueryPipe()) text: string,
    @Query('gender', new ParseEnumPipe(GenderEnum, { optional: true }))
    gender?: GenderEnum,
    @Query('useMultiLetterSymbols', new ParseBoolPipe({ optional: true }))
    useMultiLetterSymbols?: boolean,
    @Query(
      'lang',
      new ParseEnumPipe(LiteralTransLanguageEnum, { optional: true }),
    )
    lang: LiteralTransLanguageEnum = LiteralTransLanguageEnum.ARABIC,
  ): LiteralTranslationResultsDto {
    return this.literalTranslationService.fromArabicLettersToHieroglyphics(
      text,
      { useMultiLetterSymbols, gender, lang },
    );
  }
}
