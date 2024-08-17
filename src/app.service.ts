import { Injectable } from '@nestjs/common';
import { RavendbService } from './raven/raven.service';
import { LanguageEnum } from './dto/language.enum';
import { CreateWordDto } from './dto/input/create-word.dto';
import { Word } from './raven/entities/word.entity';
import { CreateSuggetionDto } from './dto/input/suggest-word.dto';

@Injectable()
export class AppService {
  constructor(private readonly ravendbService: RavendbService) {}

  async search(lang: LanguageEnum, word: string) {
    const res = await this.ravendbService
      .session()
      .query({ collection: 'word' })
      .search(`${lang}.Word`, `*${word}*`)
      .all();
    return this.toDto(res as Word[]);
  }

  private toDto(res: Word[]): Word[] {
    return res.map((word) => {
      return {
        id: word.id,
        Arabic: word.Arabic,
        Egyptian: word.Egyptian,
      };
    });
  }

  create(payload: CreateWordDto) {
    this.ravendbService.saveToDb(payload, 'word');
  }

  async createBulk(bulkPayload: CreateWordDto[]) {
    await Promise.all(
      bulkPayload.map((payload) => {
        this.ravendbService.saveToDb(payload, 'word');
      }),
    );
  }

  createUserWord(payload: CreateSuggetionDto) {
    this.ravendbService.saveToDb(payload, 'suggestion');
  }
}
