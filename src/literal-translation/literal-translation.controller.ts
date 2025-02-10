import {
  Controller,
  Get,
  ParseBoolPipe,
  ParseEnumPipe,
  Query,
} from '@nestjs/common';
import { LiteralTranslationService } from './literal-translation.service';
import { LiteralTranslationResultsDto } from './dto/literal-translation-results.dto';
import { GenderEnum } from 'src/dto/gender.enum';

@Controller('api/v1/literal-translation')
export class LiteralTranslationController {
  constructor(
    private readonly literalTranslationService: LiteralTranslationService,
  ) {}

  @Get()
  fromArabicLettersToHieroglyphics(
    @Query('text') text: string,
    @Query('multipleSoundSymbol', new ParseBoolPipe())
    mutliSoundSymbol?: boolean,
    @Query('gender', new ParseEnumPipe(GenderEnum)) gender?: GenderEnum,
  ): LiteralTranslationResultsDto {
    return this.literalTranslationService.fromArabicLettersToHieroglyphics(
      text,
      mutliSoundSymbol,
      gender,
    );
  }
}
