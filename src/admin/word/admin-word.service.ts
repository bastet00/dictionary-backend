import { Injectable } from '@nestjs/common';
import { CreateWordDto } from 'src/dto/input/create-word.dto';
import { UpdateWordDto } from 'src/dto/input/update-word.dto';
import { RavendbService } from 'src/raven/raven.service';

@Injectable()
export class AdminWordService {
  constructor(private readonly ravendbService: RavendbService) {}

  private query(skip: number, lang: string, word: string) {
    const reg = word.replace(/ا/g, '[اأإ]');

    return this.ravendbService
      .session()
      .query({ collection: 'word' })
      .skip(skip)
      .whereRegex(`${lang}.word`, `\\b${reg}.*`);
  }

  async search(page: number, perPage: number, word: string, lang: string) {
    const skip = (page - 1) * perPage;
    const total = await this.query(skip, lang, word).count();
    const totalPages = Math.ceil(total / perPage);
    const res = await this.query(skip, lang, word)
      .selectFields(['id', 'arabic', 'english', 'egyptian'])
      .take(perPage)
      .all();

    return {
      count: total,
      totalPages: totalPages,
      page: page,
      perPage: perPage,
      items: res,
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
    doc.egyptian[0].word = updateWordDto.egyptian[0].word;
    doc.egyptian[0].symbol = updateWordDto.egyptian[0].symbol;
    doc.arabic = updateWordDto.arabic;
    doc.english = updateWordDto.english ? updateWordDto.english : doc.english;
    await session.saveChanges();
    return doc;
  }
}
