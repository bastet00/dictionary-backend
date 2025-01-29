import { Injectable } from '@nestjs/common';
import { arabicToHieroglyphics } from './mappers/arabicToHieroglyphics';
import {
  CharachtersMapper,
  LiteralTranslationResultsDto,
} from './dto/literal-translation-results.dto';
@Injectable()
export class LiteralTranslationService {
  /*
    * This service is responsible for providing a literal translation of
    a word from arabic letters to hieroglyphs.
    * @param word - The word to translate
    * @returns The literal translation of the word
    */
  fromArabicLettersToHieroglyphics(
    word: string,
    options: { addition?: string } = {},
  ): LiteralTranslationResultsDto {
    const wordArray = word.split('');
    let literalTranslation = wordArray
      .map((letter) => arabicToHieroglyphics[letter] || letter)
      .join('');
    //TODO: Implement the charachtersMapper for hieroglyphics with multiple charachters
    const charachtersMapper: CharachtersMapper = wordArray.map((letter) => {
      return {
        alphabetCharachters: letter,
        hieroglyphics: arabicToHieroglyphics[letter] || letter,
      };
    });
    const { addition } = options;
    if (addition) {
      literalTranslation += addition;
    }
    return {
      literalTranslation,
      charachtersMapper,
    };
  }
}
