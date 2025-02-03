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
    multiSoundSymbol: boolean = false,
    options: { addition?: string } = {},
  ): LiteralTranslationResultsDto {
    const charachtersMapper: CharachtersMapper = [];
    const prefixLength = multiSoundSymbol ? 3 : 1;
    let literalTranslation = '';
    let start = 0;
    let end = prefixLength;
    while (start < end) {
      const prefix = word.slice(start, end);
      const { foundedObj, stopAt } = this.longgestFoundPrefix(prefix);
      const match = Object.keys(foundedObj)[0];
      if (!match) {
        literalTranslation = word;
        break;
      }

      charachtersMapper.push({
        alphabetCharachters: match,
        hieroglyphics: foundedObj[match],
      });

      literalTranslation += foundedObj[match];

      start += stopAt + 1;
      end = start + prefixLength;
      if (start + prefixLength > word.length) {
        end = word.length;
      }
    }

    const { addition } = options;
    if (addition) {
      literalTranslation += addition;
    }
    return {
      literalTranslation,
      charachtersMapper,
    };
  }

  private longgestFoundPrefix(prefix: string) {
    /**
     * @returns:
     *    foundedObj: An object with the longest found prefix mapped to its value
     *    `stopAt`: index which indicates where the match is found
     */

    if (prefix.length === 0) return { foundedObj: {}, stopAt: 0 }; //safe
    const stopAt = prefix.length - 1;
    const foundedObj = {};
    foundedObj[prefix] = arabicToHieroglyphics[prefix];

    if (!foundedObj[prefix]) {
      return this.longgestFoundPrefix(prefix.slice(0, stopAt));
    }

    return { foundedObj, stopAt };
  }
}
