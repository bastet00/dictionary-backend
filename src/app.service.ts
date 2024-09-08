import { Injectable } from '@nestjs/common';
import { RavendbService } from './raven/raven.service';
import { LanguageEnum } from './dto/language.enum';
import { BulkCreateWordDto, CreateWordDto } from './dto/input/create-word.dto';
import { Word } from './raven/entities/word.entity';

@Injectable()
export class AppService {
  constructor(private readonly ravendbService: RavendbService) {}

  async search(lang: LanguageEnum, word: string) {
    const resExactMatch = await this.ravendbService
      .session()
      .query({ collection: 'word' })
      .whereEquals(`${lang}.Word`, word)
      .take(10)
      .all();
    if (resExactMatch.length != 0) {
      return this.toDto(resExactMatch as Word[]);
    }
    const resFullTextSearch = await this.ravendbService
      .session()
      .query({ collection: 'word' })
      .search(`${lang}.Word`, `*${word}*`)
      .take(10)
      .all();
    return this.toDto(resFullTextSearch as Word[]);
  }

  private toDto(res: Word[]): Word[] {
    return res.map((word) => {
      return {
        id: word.id,
        Arabic: word.Arabic,
        Egyptian: word.Egyptian,
        English: word.English,
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
}
