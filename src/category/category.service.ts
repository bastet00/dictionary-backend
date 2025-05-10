import { Injectable } from '@nestjs/common';
import { CategoryEnum } from './dto/category.enum';
import { RavendbService } from 'src/raven/raven.service';
import { Word } from 'src/raven/entities/word.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly ravendbService: RavendbService) {}

  async findWordsByCategoryId(categoryId: string): Promise<Word[]> {
    const session = this.ravendbService.session();
    const res = (await session
      .query<Word>({ collection: 'word' })
      .whereEquals('category', categoryId)
      .selectFields(['id', 'arabic', 'english', 'egyptian', 'category'])
      .all()) as Word[];
    return res.map((word) => this.toCategoryWordDto(word));
  }

  private categoryEnumAsArray() {
    return Object.keys(CategoryEnum);
  }

  private toCategoryWordDto(word: Word) {
    return {
      id: word.id,
      arabic: word.arabic,
      egyptian: word.egyptian,
      english: word.english,
      category: word.category,
      resources: word.resources,
      createdAt: word.createdAt,
      updatedAt: word.updatedAt,
    };
  }
  getCategory() {
    return {
      category: this.categoryEnumAsArray(),
    };
  }
}
