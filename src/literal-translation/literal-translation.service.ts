import { Injectable } from '@nestjs/common';
import { arabicToHieroglyphics } from './mappers/arabicToHieroglyphics';
import { LiteralTranslationResultsDto } from './dto/literal-translation-results.dto';
@Injectable()
export class LiteralTranslationService {
  /*
    * This service is responsible for providing a literal translation of
    a word from arabic letters to hieroglyphs.
    * @param word - The word to translate
    * @returns The literal translation of the word
    */
  fromArabicLettersToHieroglyphics(word: string): LiteralTranslationResultsDto {
    const literalTranslation = word
      .split('')
      .map((letter) => arabicToHieroglyphics[letter] || letter)
      .join('');
    return {
      literalTranslation,
    };
  }
}
