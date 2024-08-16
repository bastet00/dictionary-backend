import { Injectable } from '@nestjs/common';
import { RavendbService } from './raven/raven.service';
import { LanguageEnum } from './dto/language.enum';
import { CreateWordDto } from './dto/input/create-word.dto';
import { toUTF32Hex } from './util/utf32-transform';
import * as crypto from 'crypto';
import { Word } from './raven/entities/word.entity';
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
  async create(payload: CreateWordDto) {
    const db = this.ravendbService.session();
    await db.store(
      { ...payload, '@metadata': { '@collection': 'word' } },
      crypto.randomUUID(),
      { documentType: 'word' },
    );
    await db.saveChanges();
  }

  async createBulk(bulkPayload: CreateWordDto[]) {
    await Promise.all(
      bulkPayload.map((payload) => {
        this.create(payload);
      }),
    );
  }
}
