import { Injectable } from '@nestjs/common';
import { LanguageEnum } from 'src/dto/language.enum';
import { WordService } from 'src/word/word.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SentenceService } from './sentence.service';
import { Sentence } from 'src/raven/entities/sentence.entity';

@Injectable()
export class TranslationService {
  constructor(
    private readonly wordService: WordService,
    private readonly sentenceService: SentenceService,
  ) {}

  async translate(language: LanguageEnum, text: string) {
    const lang = this.wordService.languageSecretSwitch(text, language);
    const dbVectorSearchResult =
      await this.sentenceService.vectorSimilaritySearch(lang, text);

    const { header, footer, body } = this.preparePrompt(
      dbVectorSearchResult,
      lang,
      text,
    );
    const prompt = header + body + footer;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([prompt]);
    console.log(prompt);
    console.log(result.response.text());

    return {
      prompt: prompt,
      googleResponse: result.response.text(),
    };
  }

  private preparePrompt(
    dbResult: Sentence[],
    lang: LanguageEnum,
    text: string,
  ) {
    const prompt = {
      header: this.getPromptHeader(),
      body: this.getPromptBody(dbResult, lang),
      footer: this.getPromptFooter(text),
    };
    return prompt;
  }

  private getPromptHeader(): string {
    return `You are an Egyptologist translating English to ancient Egyptian.
            Use the following translations as a reference (template: [word -> transiliteriation determinative]):
    `;
  }

  private getPromptFooter(text: string): string {
    return `
    Provide final result of translation with translation tag.
    Answer only with translation write each word of the translation as a key and its value in array fist index is arabic and second is english.
    Translate the following sentence to ancient Egyptian: ${text}.
    `;
  }

  private getPromptBody(
    dbResult: Sentence[],
    queryLangauge: LanguageEnum,
  ): string {
    return dbResult
      .map((sentece: Sentence) => {
        return `- ${sentece[queryLangauge]} -> ${sentece.british}\n`;
      })
      .join('\n');
  }

  // word
  // private handleDifferentPromptArgs(
  //   dbResult: Word[],
  //   queryLangauge: LanguageEnum,
  // ) {
  //   const customizePrompt = dbResult
  //     .map((word) => {
  //       const egy = word.egyptian;
  //       const targetLanguage = word[queryLangauge] as { word: string }[];
  //       const unicode = egy[0].symbol;
  //       const symbol = String.fromCodePoint(parseInt(unicode, 16));
  //       return `- ${targetLanguage[0].word} -> ${egy[0].word} ${symbol}\n`;
  //     })
  //     .join('\n');
  //   return customizePrompt;
  // }
  //
}
