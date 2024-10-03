import { Injectable } from '@nestjs/common';
import { CreateWordDto } from 'src/dto/input/create-word.dto';
import { UpdateWordDto } from 'src/dto/input/update-word.dto';
import { RavendbService } from 'src/raven/raven.service';

@Injectable()
export class AdminService {
  constructor(private readonly ravendbService: RavendbService) {}

  private query(skip: number, lang: string, word: string) {
    const reg = word.replace(/ا/g, '[اأإ]');

    return this.ravendbService
      .session()
      .query({ collection: 'word' })
      .skip(skip)
      .whereRegex(`${lang}.Word`, `\\b${reg}.*`);
  }

  async search(page: number, perPage: number, word: string, lang: string) {
    const MAXPP = 100;
    const skip = (page - 1) * perPage;
    const total = await this.query(skip, lang, word).count();
    const maxPerPage = Math.min(MAXPP, perPage);
    const totalPages = Math.ceil(total / maxPerPage);

    const res = await this.query(skip, lang, word)
      .selectFields(['id', 'Arabic', 'English', 'Egyptian'])
      .take(maxPerPage)
      .all();

    return {
      totalPages: totalPages,
      page: page,
      per_page: maxPerPage,
      items: res,
      count: total,
    };
  }

  async delete(id: string) {
    const session = this.ravendbService.session();
    await session.delete(id);
    await session.saveChanges();
  }

  async patch(id: string, updateWordDto: UpdateWordDto) {
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
