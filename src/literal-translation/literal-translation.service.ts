import { Injectable } from '@nestjs/common';
import { arabicToHieroglyphics } from './mappers/arabicToHieroglyphics';
@Injectable()
export class LiteralTranslationService {
  /*
    * This service is responsible for providing a literal translation of
    a word from arabic letters to hieroglyphs.
    * @param word - The word to translate
    * @returns The literal translation of the word
    */
  fromArabicLettersToHieroglyphics(word: string): string {
    return word
      .split('')
      .map((letter) => arabicToHieroglyphics[letter] || letter)
      .join('');
  }
}
