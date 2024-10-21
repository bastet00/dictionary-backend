import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RavendbService } from '../raven/raven.service';
import { LanguageEnum } from '../dto/language.enum';
import { BulkCreateWordDto, CreateWordDto } from '../dto/input/create-word.dto';
import { Word } from '../raven/entities/word.entity';

@Injectable()
export class WordService {
  constructor(private readonly ravendbService: RavendbService) {}

  private applyRegex(word: string) {
    let wordReg = word.replace(/ا/g, '[اأإ]');
    if (word.length <= 2) {
      wordReg = `\\b${wordReg}\\b`;
    }
    return wordReg;
  }

  async search(lang: LanguageEnum, word: string) {
    const regSearch = this.applyRegex(word);
    const session = this.ravendbService.session();
    const resFullTextSearch = await session
      .query({ collection: 'word' })
      .openSubclause()
      .whereRegex(`${lang}.word`, `^${regSearch}$`)
      .closeSubclause()
      .orElse()
      .openSubclause()
      .whereRegex(`${lang}.word`, `.*${regSearch}.*`)
      .closeSubclause()
      .take(10)
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

  async getOne(id: string) {
    const doc = (await this.ravendbService.session().load(id)) as Word;
    if (!doc) {
      throw new NotFoundException('id doesnt exist');
    }
    return doc;
  }
}
