import { Injectable } from '@nestjs/common';
import { LanguageEnum } from 'src/dto/language.enum';
import { WordService } from 'src/word/word.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Word } from 'src/raven/entities/word.entity';

@Injectable()
export class TranslationService {
  constructor(private readonly wordService: WordService) {}

  async translate(language: LanguageEnum, text: string) {
    const lang = this.wordService.languageSecretSwitch(text, language);
    const dbResult = await this.wordService.searchAndSuggest(lang, text);

    const prompt = this.preparePrompt(dbResult, lang, text);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // reaplce model name
    console.log(prompt);
    console.log(model);
  }

  private preparePrompt(dbResult: Word[], lang: LanguageEnum, text: string) {
    let prompt = '';
    prompt += this.getPromptHeader();
    // TODO: handle arguments
    prompt += this.getPromptFooter(text);
    this.handleDifferentPromptArgs(dbResult, lang);
    return prompt;
  }

  private getPromptHeader(): string {
    return `You are an Egyptologist translating English to ancient Egyptian.
            Use the following translations as a reference (template: [word -> transiliteriation determinative]):
    `;
  }

  private getPromptFooter(text: string): string {
    return `
    Example Format:
      - Ra on the front of: ra 𓇳 nxt 𓀜
      - my name is amro -> rni Amro 𓀁
    Provide final result of translation with translation tag.
    Translate the following sentence to ancient Egyptian: ${text}.
    `;
  }

  private handleDifferentPromptArgs(
    dbResult: Word[],
    queryLangauge: LanguageEnum,
  ) {
    console.log(dbResult, queryLangauge);
    const customizePrompt = `
      - x1 from query -> x1 value from db +  𓀁
      - x2 from query -> x2 value from db + symbol
      - and so on
      - (suffix prn.) I , me , my -> i𓀁
      - I -> ink 𓀁
      - home -> pr 𓉐
`;
    return customizePrompt;
  }
}
