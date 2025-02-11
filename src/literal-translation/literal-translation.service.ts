import { Injectable } from '@nestjs/common';
import { arabicToHieroglyphics } from './mappers/arabicToHieroglyphics';
import {
  CharachtersMapper,
  LiteralTranslationResultsDto,
} from './dto/literal-translation-results.dto';
import { GenderEnum } from './dto/gender.enum';

@Injectable()
export class LiteralTranslationService {
  /*
    * This service is responsible for providing a literal translation of
    a word from arabic letters to hieroglyphs.
    * @param text - The text to translate
    * @returns The literal translation of the word
    */
  fromArabicLettersToHieroglyphics(
    text: string,
    options: { multiSoundSymbol?: boolean; gender?: GenderEnum } = {},
  ): LiteralTranslationResultsDto {
    const { multiSoundSymbol, gender } = options;
    text = text.replaceAll(' ', '');
    const charachtersMapper: CharachtersMapper = [];
    const prefixLength = multiSoundSymbol ? 3 : 1;
    let literalTranslation = '';
    let start = 0;
    let end = prefixLength;

    while (start < end) {
      const prefix = text.slice(start, end);
      const { foundedObj, stopAt } = this.longestFoundPrefix(prefix);
      const match = Object.keys(foundedObj)[0];

      if (!match) {
        literalTranslation = text;
        break;
      }

      charachtersMapper.push({
        alphabetCharachters: match,
        hieroglyphics: foundedObj[match],
      });
      literalTranslation += foundedObj[match];

      start += stopAt + 1;
      end = start + prefixLength;
      if (end > text.length) {
        end = text.length;
      }
    }

    literalTranslation = this.appendGenderSymbol(gender, literalTranslation);

    return {
      literalTranslation,
      charachtersMapper,
    };
  }

  private appendGenderSymbol(gender: GenderEnum, literalTranslation: string) {
    if (gender === GenderEnum.MALE) {
      literalTranslation += '𓀀';
    }
    if (gender === GenderEnum.FEMALE) {
      literalTranslation += '𓁐';
    }
    return literalTranslation;
  }

  /**
   * @returns:
   *    foundedObj: An object with the longest found prefix mapped to its value
   *    `stopAt`: index which indicates where the match is found
   */
  private longestFoundPrefix(prefix: string) {
    if (prefix.length === 0) return { foundedObj: {}, stopAt: 0 }; //safe
    const stopAt = prefix.length - 1;
    const foundedObj = {};
    foundedObj[prefix] = arabicToHieroglyphics[prefix];

    if (!foundedObj[prefix]) {
      return this.longestFoundPrefix(prefix.slice(0, stopAt));
    }

    return { foundedObj, stopAt };
  }
}
