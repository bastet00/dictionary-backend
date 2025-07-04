import { Injectable } from '@nestjs/common';
import { CreateWordDto } from 'src/dto/input/word/create-word.dto';
import { RavendbService } from '../../raven/raven.service';
import { UpdateWordDto } from './dto/update-word.dto';
import { fromTransliterationToEgyptian } from 'src/dto/transformer/to-egyptian/from-transliteration-to-egyptian';
import { Word } from 'src/raven/entities/word.entity';

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
      .selectFields(['id', 'arabic', 'english', 'egyptian', 'category'])
      .take(perPage)
      .orderByScore()
      .all();

    return {
      count: total,
      totalPages: totalPages,
      page: page,
      perPage: perPage,
      items: res,
    };
  }

  create(createWordDto: CreateWordDto) {
    createWordDto = this.addWordToEgyptianDto(createWordDto);
    const timeNow = new Date().toISOString();
    return this.ravendbService.saveToDb(
      { ...createWordDto, createdAt: timeNow, updatedAt: timeNow },
      'word',
    );
  }

  async delete(id: string) {
    const session = this.ravendbService.session();
    await session.delete(id);
    await session.saveChanges();
  }

  async patch(id: string, updateWordDto: UpdateWordDto) {
    const session = this.ravendbService.session();
    const doc = (await session.load(id)) as Word;
    doc.egyptian[0].word = updateWordDto.egyptian[0].word;
    doc.egyptian[0].symbol = updateWordDto.egyptian[0].symbol;
    doc.arabic = updateWordDto.arabic;
    doc.english = updateWordDto.english ? updateWordDto.english : doc.english;
    doc.category = updateWordDto.category
      ? updateWordDto.category
      : doc.category;

    doc.updatedAt = new Date().toISOString();
    await session.saveChanges();
    return doc;
  }

  private addWordToEgyptianDto(createWordDto: CreateWordDto) {
    for (const egyptian of createWordDto.egyptian) {
      if (!egyptian.word && egyptian.transliteration) {
        egyptian.word = fromTransliterationToEgyptian({
          value: egyptian.transliteration,
        });
      }
    }
    return createWordDto;
  }
}
