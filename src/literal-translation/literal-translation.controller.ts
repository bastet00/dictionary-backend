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

@Controller('api/v1/literal-translation')
export class LiteralTranslationController {
  constructor(
    private readonly literalTranslationService: LiteralTranslationService,
  ) {}

  @Get()
  fromArabicLettersToHieroglyphics(
    @Query('text') text: string,
    @Query('gender', new ParseEnumPipe(GenderEnum, { optional: true }))
    gender: GenderEnum,
    @Query('multiSoundSymbol', new ParseBoolPipe({ optional: true }))
    multiSoundSymbol?: boolean,
  ): LiteralTranslationResultsDto {
    return this.literalTranslationService.fromArabicLettersToHieroglyphics(
      text,
      { multiSoundSymbol, gender },
    );
  }
}
