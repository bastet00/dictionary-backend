import { Injectable } from '@nestjs/common';
import { arabicToHieroglyphics } from './mappers/arabicToHieroglyphics';
import {
  LettersMapper,
  LiteralTranslationResultsDto,
} from './dto/literal-translation-results.dto';
import { GenderEnum, HieroglyphicsEnum } from './dto/gender.enum';
import { LiteralTransLanguageEnum } from './dto/language.enum';

// NOTE: detect prefix range
// NOTE: detect lang to swap object(object loaded, swapped once)
// i have to learn write this word ( hieroglyphics )
@Injectable()
export class LiteralTranslationService {
  alreadySwapped: boolean;
  constructor() {
    this.alreadySwapped = false;
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
    );

    return {
      literalTranslation,
      lettersMapper,
    };
  }

  private performSwapOnce(): void {
    // perform an object swapping if not done before
    if (!this.alreadySwapped) {
      for (const [k, v] of Object.entries(arabicToHieroglyphics)) {
        // avoid overwrite
        if (!arabicToHieroglyphics[v]) {
          arabicToHieroglyphics[v] = k;
        }
      }
      this.alreadySwapped = true;
    }
  }

  private detectObjectSwapAndRange(
    lang: LiteralTransLanguageEnum,
    multiLetter: boolean,
  ) {
    const maxPrefixRange = 3;
    switch (lang) {
      case LiteralTransLanguageEnum.HIEROGLYPHICS:
        this.performSwapOnce();
        return maxPrefixRange;
      case LiteralTransLanguageEnum.ARABIC:
        return multiLetter ? maxPrefixRange : 1;
    }
  }

  private handleTranslation(
    text: string,
    prefixRange: number,
    gender: GenderEnum,
  ): LiteralTranslationResultsDto {
    const lettersMapper: LettersMapper[] = [];
    let literalTranslation = '';
    let start = 0;
    let end = prefixRange;
    while (start < end) {
      const prefix = text.slice(start, end);
      const { foundedObj, stopAt } = this.longestFoundPrefix(prefix);

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
  private longestFoundPrefix(prefix: string): {
    foundedObj: object;
    stopAt: number;
  } {
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
