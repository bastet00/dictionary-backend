import { Injectable } from '@nestjs/common';
import { RavendbService } from './raven/raven.service';
import { LanguageEnum } from './dto/language.enum';

@Injectable()
export class AppService {
  constructor(private readonly ravendbService: RavendbService) {}
  async search(lang: LanguageEnum, word: string) {
    const res = await this.ravendbService
      .session()
      .query({ collection: 'word' })
      .search(lang, `*${word}*`)
      .all();
    return res;
  }
}
