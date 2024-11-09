import { Injectable, NotFoundException } from '@nestjs/common';
import { RavendbService } from '../raven/raven.service';
import { LanguageEnum } from '../dto/language.enum';
import { BulkCreateWordDto, CreateWordDto } from '../dto/input/create-word.dto';
import { Word, WordDetailDto } from '../raven/entities/word.entity';
import { toHieroglyphicsSign } from 'src/dto/transformer';

@Injectable()
export class WordService {
  constructor(private readonly ravendbService: RavendbService) {}

  searchPatterns(word: string) {
    const origWordLength = word.trim().length;
    const lettersSwapping = word.trim().replace(/ا/g, '[اأإ]');
    const patterns = {
      exactOrGlobalSearch:
        origWordLength <= 3
          ? this.exactRegexMatch(lettersSwapping)
          : `.*${lettersSwapping}.*`,
      wordSplited: `${this.splitWord(lettersSwapping)}`,
    };
    return patterns;
  }

  private splitWord(word: string) {
    const words = word.split(' ');

    if (words.length > 1) {
      let concat = '';

      words.slice(0, 3).forEach((word) => {
        concat += `.*${word}.*|`;
      });

      return concat.slice(0, -1);
    }

    return `.*${words[0].slice(0, Math.ceil(words[0].length / 2))}.*`;
  }

  private exactRegexMatch(word: string) {
    return `^\\b${word}\\b$`;
  }

  async search(lang: LanguageEnum, word: string) {
    const patterns = this.searchPatterns(word);
    console.log(patterns);

    const session = this.ravendbService.session();
    const resFullTextSearch = await session
      .query({ collection: 'word' })
      .openSubclause()
      .whereRegex(`${lang}.word`, patterns.exactOrGlobalSearch)
      .closeSubclause()
      .orElse()
      .openSubclause()
      .whereRegex(`${lang}.word`, patterns.wordSplited)
      .closeSubclause()
      .take(10)
      .orderByScore()
      .all();
    return this.toDto(resFullTextSearch as Word[]);
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
