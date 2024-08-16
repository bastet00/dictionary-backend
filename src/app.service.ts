import { Injectable } from '@nestjs/common';
import { RavendbService } from './raven/raven.service';
import { LanguageEnum } from './dto/language.enum';
import { CreateWordDto } from './dto/input/create-word.dto';
import { toUTF32Hex } from './util/utf32Transform';

@Injectable()
export class AppService {
  constructor(private readonly ravendbService: RavendbService) {}
  async search(lang: LanguageEnum, word: string) {
    const res = await this.ravendbService
      .session()
      .query({ collection: 'word' })
      .search(`${lang}.Word`, `*${word}*`)
      .all();
    return res;
  }
  async create(payload: CreateWordDto) {
    const db = this.ravendbService.session();
    payload.Egyptian[0].Unicode = toUTF32Hex(payload.Egyptian[0].Symbol);
    await db.store({ ...payload, collection: 'word' });
    await db.saveChanges();
    return 'doc created';
  }
}
