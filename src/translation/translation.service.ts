import { Injectable } from '@nestjs/common';
import { LanguageEnum } from '../dto/language.enum';
import { WordService } from '../word/word.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SentenceService } from './sentence.service';
import { Sentence } from '../raven/entities/sentence.entity';
import { Word, WordValue } from '../raven/entities/word.entity';

@Injectable()
export class TranslationService {
  constructor(
    private readonly wordService: WordService,
    private readonly sentenceService: SentenceService,
  ) {}

  async translate(language: LanguageEnum, text: string) {
    const lang = this.wordService.languageSecretSwitch(text, language);
    const sentences = await this.sentenceService.vectorSimilaritySearch(
      lang,
      text,
    );
    const words = await this.wordService.vectorSimilaritySearch(lang, text);
    const { system, contextLearning, question } = this.preparePrompt(
      sentences,
      words,
      lang,
      text,
    );
    const prompt = system + contextLearning + question;
    console.log(prompt);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const result = await model.generateContent([prompt]);

    return {
      prompt: prompt,
      googleResponse: result.response.text(),
    };
  }

  private preparePrompt(
    sentences: Sentence[],
    words: Word[],
    lang: LanguageEnum,
    text: string,
  ) {
    const prompt = {
      system: this.getSystemPrompt(),
      contextLearning: this.getContextLearningPrompt(sentences, words, lang),
      question: this.getQuestionPrompt(text),
    };
    return prompt;
  }

  private getSystemPrompt(): string {
    return `You are an Egyptologist translating English to ancient Egyptian.
            Use the following translations as a reference (template: [word -> transiliteriation determinative]):
    `;
  }

  private getQuestionPrompt(text: string): string {
    return `
    Provide final result of translation with translation tag.
    Answer only with the translation.
    If you were not provided vocabulary, answer with: "No translation found".
    Translate the following sentence to ancient Egyptian: ${text}.
    `;
  }

  private getContextLearningPrompt(
    sentences: Sentence[],
    words: Word[],
    queryLanguage: LanguageEnum,
  ): string {
    return (
      sentences
        .map((sentence: Sentence) => {
          return `- ${sentence[queryLanguage]} -> ${sentence.transliteration}\n`;
        })
        .join('\n') +
      words
        .map((word: Word) => {
          return `- ${word[queryLanguage].map((wordValue: WordValue) => wordValue.word).join(',')} -> ${word.egyptian[0].transliteration}\n`;
        })
        .join('\n')
    );
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
