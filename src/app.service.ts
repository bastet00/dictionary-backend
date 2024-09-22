import { Injectable } from '@nestjs/common';
import { RavendbService } from './raven/raven.service';
import { LanguageEnum } from './dto/language.enum';
import { BulkCreateWordDto, CreateWordDto } from './dto/input/create-word.dto';
import { Word } from './raven/entities/word.entity';
import { UpdateWordDto } from './dto/input/update-word.dto';

@Injectable()
export class AppService {
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
      .whereRegex(`${lang}.Word`, `^${regSearch}$`)
      .closeSubclause()
      .orElse()
      .openSubclause()
      .whereRegex(`${lang}.Word`, `.*${regSearch}.*`)
      .closeSubclause()
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

  async delete(id: string) {
    const session = this.ravendbService.session();
    await session.delete(id);
    await session.saveChanges();
  }

  async patch(id: string, updateWordDto: UpdateWordDto) {
    // Other Egyptian values is kept the same
    const session = this.ravendbService.session();
    const doc = (await session.load(id)) as CreateWordDto;
    doc.Egyptian[0].Word = updateWordDto.Egyptian[0].Word;
    doc.Egyptian[0].Symbol = updateWordDto.Egyptian[0].Symbol;
    doc.Arabic = updateWordDto.Arabic;
    doc.English = updateWordDto.English ? updateWordDto.English : doc.English;
    await session.saveChanges();
    return doc;
  }
}
