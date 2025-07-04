import { Injectable } from '@nestjs/common';
import { arabicToHieroglyphics } from './mappers/arabicToHieroglyphics';
import {
  LettersMapper,
  LiteralTranslationResultsDto,
} from './dto/literal-translation-results.dto';
import { GenderEnum, HieroglyphicsEnum } from './dto/gender.enum';
import { LiteralTransLanguageEnum } from './dto/language.enum';
import { hieroglyphicsToArabic } from './mappers/heiroglyphicsToArabic';
import { englishToHieroglyphics } from './mappers/englishToHieroglyphics';

const letterToHieroglyphics = {
  ...arabicToHieroglyphics,
  ...englishToHieroglyphics,
};

@Injectable()
export class LiteralTranslationService {
  /*
    * This service is responsible for providing a literal translation of
    a word from arabic letters to hieroglyphs and versal versa.
    * @param text - The text to translate
    * @param useMultiLetterSymbols - use the multi letter matching
    * @param gender - add gender symbol
    * @returns The literal translation of the word
    */

  getLiteralTranslation(
    text: string,
    options: {
      useMultiLetterSymbols?: boolean;
      gender?: GenderEnum;
      lang?: LiteralTransLanguageEnum;
    } = {},
  ): LiteralTranslationResultsDto {
    const { useMultiLetterSymbols, gender, lang } = options;

    if (!text) {
      return {
        literalTranslation: '',
        lettersMapper: [],
      };
    }

    const prefixRange = this.detectObjectSwapAndRange(
      lang,
      useMultiLetterSymbols,
    );

    const { lettersMapper, literalTranslation } = this.handleTranslation(
      text,
      prefixRange,
      gender,
      lang,
    );

    return {
      literalTranslation,
      lettersMapper,
    };
  }

  private detectObjectSwapAndRange(
    lang: LiteralTransLanguageEnum,
    multiLetter: boolean,
  ) {
    const maxPrefixRange = 3;
    switch (lang) {
      case LiteralTransLanguageEnum.egyptian:
        return maxPrefixRange;
      case LiteralTransLanguageEnum.arabic:
        return multiLetter ? maxPrefixRange : 1;
      case LiteralTransLanguageEnum.english:
        return multiLetter ? maxPrefixRange : 1;
    }
  }

  private handleTranslation(
    text: string,
    prefixRange: number,
    gender: GenderEnum,
    lang: LiteralTransLanguageEnum,
  ): LiteralTranslationResultsDto {
    const lettersMapper: LettersMapper[] = [];
    let literalTranslation = '';
    let start = 0;
    let end = prefixRange;
    const literalTranslationMapper =
      lang === LiteralTransLanguageEnum.arabic ||
      lang === LiteralTransLanguageEnum.english
        ? letterToHieroglyphics
        : hieroglyphicsToArabic;
    while (start < end) {
      const prefix = text.slice(start, end);
      const { foundedObj, stopAt } = this.longestFoundPrefix(
        prefix,
        literalTranslationMapper,
      );
      let match = Object.keys(foundedObj)[0];

      if (!match) {
        match = prefix[0];
        foundedObj[match] = match;
      }

      lettersMapper.push({
        alphabetLetters: match,
        hieroglyphics: foundedObj[match],
      });
      literalTranslation += foundedObj[match];

      start += stopAt + 1;
      end = start + prefixRange;
      if (end > text.length) {
        end = text.length;
      }
    }

    literalTranslation += this.appendGenderSymbol(gender);
    return { lettersMapper, literalTranslation };
  }

  private appendGenderSymbol(gender: GenderEnum): string {
    return gender ? HieroglyphicsEnum[gender] : '';
  }

  /**
   * @returns:
   *    foundedObj: An object with the longest found prefix mapped to its value
   *    `stopAt`: index which indicates where the match is found
   */
  private longestFoundPrefix(
    prefix: string,
    literalTranslationMapper: LiteralTranslationLangMapper,
  ) {
    if (prefix.length === 0) return { foundedObj: {}, stopAt: 0 }; //safe

    const stopAt = prefix.length - 1;
    const longestFoundedPrefixMap = {};
    longestFoundedPrefixMap[prefix] = literalTranslationMapper[prefix];

    if (!longestFoundedPrefixMap[prefix]) {
      return this.longestFoundPrefix(
        prefix.slice(0, stopAt),
        literalTranslationMapper,
      );
    }

    return { foundedObj: longestFoundedPrefixMap, stopAt };
  }
}
