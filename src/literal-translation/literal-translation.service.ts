import { Injectable } from '@nestjs/common';
import { arabicToHieroglyphics } from './mappers/arabicToHieroglyphics';
import {
  LettersMapper,
  LiteralTranslationResultsDto,
} from './dto/literal-translation-results.dto';
import { GenderEnum, HieroglyphicsEnum } from './dto/gender.enum';
import { LiteralTransLanguageEnum } from './dto/language.enum';
import { getHeiroToArabicObject } from './mappers/heiroglyphicsToArabic';
import { LiteralTranslationObjects } from './dto/literal-translation.dto';

@Injectable()
export class LiteralTranslationService {
  private translationObjects = {} as LiteralTranslationObjects;

  constructor() {
    this.cacheTranslationObject();
  }

  private cacheTranslationObject() {
    if (!this.translationObjects[LiteralTransLanguageEnum.HIEROGLYPHICS]) {
      this.translationObjects[LiteralTransLanguageEnum.HIEROGLYPHICS] =
        getHeiroToArabicObject();
    }

    if (!this.translationObjects[LiteralTransLanguageEnum.ARABIC]) {
      this.translationObjects[LiteralTransLanguageEnum.ARABIC] =
        arabicToHieroglyphics;
    }
  }

  /*
    * This service is responsible for providing a literal translation of
    a word from arabic letters to hieroglyphs.
    * @param text - The text to translate
    * @returns The literal translation of the word
    */
  fromArabicLettersToHieroglyphics(
    text: string,
    options: {
      useMultiLetterSymbols?: boolean;
      gender?: GenderEnum;
      lang?: LiteralTransLanguageEnum;
    } = {},
  ): LiteralTranslationResultsDto {
    const { useMultiLetterSymbols, gender, lang } = options;
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
      case LiteralTransLanguageEnum.HIEROGLYPHICS:
        return maxPrefixRange;
      case LiteralTransLanguageEnum.ARABIC:
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
    while (start < end) {
      const prefix = text.slice(start, end);
      const { foundedObj, stopAt } = this.longestFoundPrefix(prefix, lang);
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
    lang: LiteralTransLanguageEnum,
  ): {
    foundedObj: object;
    stopAt: number;
  } {
    if (prefix.length === 0) return { foundedObj: {}, stopAt: 0 }; //safe

    const stopAt = prefix.length - 1;
    const foundedObj = {};
    foundedObj[prefix] = this.translationObjects[lang][prefix];

    if (!foundedObj[prefix]) {
      return this.longestFoundPrefix(prefix.slice(0, stopAt), lang);
    }

    return { foundedObj, stopAt };
  }
}
