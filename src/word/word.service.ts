import { Injectable, NotFoundException } from '@nestjs/common';
import { RavendbService } from '../raven/raven.service';
import { LanguageEnum } from '../dto/language.enum';
import { BulkCreateWordDto, CreateWordDto } from '../dto/input/create-word.dto';
import { Word, WordDetailDto } from '../raven/entities/word.entity';
import { toHieroglyphicsSign } from 'src/dto/transformer';

@Injectable()
export class WordService {
  constructor(private readonly ravendbService: RavendbService) {}

  private isLatin(text: string): boolean {
    return [...text].some(
      (char) => (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'),
    );
  }

  languageSecretSwitch(word: string): LanguageEnum {
    if (this.isLatin(word)) {
      return LanguageEnum.english;
    }
    return LanguageEnum.arabic;
  }

  searchPatterns(word: string) {
    return `^\\b${word}\\b$`.trim().replace(/ا/g, '[اأإ]');
  }

  private splitWord(word: string) {
    const words = word.trim().split(' ');
    let wordsRegex = '';

    words.forEach((word) => {
      if (word.substring(0, 2) === 'ال') {
        wordsRegex += `${this.searchPatterns(word.substring(2))}|`;
      }
      wordsRegex += `${this.searchPatterns(word)}|`;
    });
    return wordsRegex.slice(0, -1);
  }

  async searchAndSuggest(lang: LanguageEnum, word: string): Promise<Word[]> {
    const results = await this.search(lang, word);
    if (results.length) {
      return results;
    }
    const terms = await this.suggestions(lang, word);
    const session = this.ravendbService.session();
    const suggestionResults = await session
      .query<Word>({ collection: 'word' })
      .whereIn(`${lang}.word`, terms)
      .take(10)
      .orderByScoreDescending()
      .all();
    return this.toDto(suggestionResults);
  }
  async suggestions(lang: LanguageEnum, word: string): Promise<string[]> {
    const session = this.ravendbService.session();
    const suggestions = await session
      .query({ collection: 'word' })
      .suggestUsing((x) =>
        x.byField(`${lang}.word`, word).withOptions({
          accuracy: 0.65,
          pageSize: 5,
          distance: 'NGram',
          sortMode: 'Popularity',
        }),
      )
      .execute();
    return suggestions[`${lang}.word`].suggestions;
  }

  async search(lang: LanguageEnum, word: string): Promise<Word[]> {
    const session = this.ravendbService.session();
    let resFullTextSearch = await session
      .query<Word>({ collection: 'word' })
      .openSubclause()
      .whereRegex(`${lang}.word`, this.searchPatterns(word))
      .closeSubclause();

    if (lang === LanguageEnum.arabic && word.substring(0, 2) === 'ال') {
      resFullTextSearch = resFullTextSearch
        .orElse()
        .openSubclause()
        .whereRegex(`${lang}.word`, this.searchPatterns(word.substring(2)))
        .closeSubclause();
    }
    if (word.split(' ').length > 1) {
      resFullTextSearch = resFullTextSearch
        .orElse()
        .openSubclause()
        .whereRegex(`${lang}.word`, this.splitWord(word))
        .closeSubclause();
    }
    const searchResults = await resFullTextSearch
      .take(10)
      .orderByScoreDescending()
      .all();
    return this.toDto(searchResults);
  }

  private toDto(res: Word[]): Word[] {
    return res.map((word) => {
      return {
        id: word.id,
        arabic: word.arabic,
        egyptian: word.egyptian,
        english: word.english,
      };
    });
  }

  create(payload: CreateWordDto) {
    this.ravendbService.saveToDb(payload, 'word');
  }

  async createBulk(bulkPayload: BulkCreateWordDto) {
    await Promise.all(
      bulkPayload.words.map((payload) => {
        this.ravendbService.saveToDb(payload, 'word');
      }),
    );
  }

  async getOne(id: string): Promise<WordDetailDto> {
    const doc = (await this.ravendbService.session().load(id)) as Word;
    if (!doc) {
      throw new NotFoundException('id doesnt exist');
    }
    return {
      ...doc,
      egyptian: [
        {
          ...doc.egyptian[0],
          hieroglyphicSigns: toHieroglyphicsSign(doc.egyptian[0].hieroglyphics),
        },
      ],
    };
  }
}
