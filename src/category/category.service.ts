import { Injectable } from '@nestjs/common';
import { CategoryEnum } from './dto/category.enum';
import { RavendbService } from '../raven/raven.service';
import { Word } from 'src/raven/entities/word.entity';

type Category = {
  id: CategoryEnum;
  arabic: string;
  english: string;
};

@Injectable()
export class CategoryService {
  private readonly newProperty = 'وظائف';

  private readonly categories: Category[] = [
    { id: CategoryEnum.gods, arabic: 'آلهة', english: CategoryEnum.gods },
    {
      id: CategoryEnum.numbers,
      arabic: 'أرقام',
      english: CategoryEnum.numbers,
    },
    { id: CategoryEnum.family, arabic: 'عائلة', english: CategoryEnum.family },
    {
      id: CategoryEnum.animals,
      arabic: 'حيوانات',
      english: CategoryEnum.animals,
    },
    { id: CategoryEnum.colors, arabic: 'ألوان', english: CategoryEnum.colors },
    { id: CategoryEnum.food, arabic: 'طعام', english: CategoryEnum.food },
    { id: CategoryEnum.body, arabic: 'جسم', english: CategoryEnum.body },
    { id: CategoryEnum.symbols, arabic: 'رموز', english: CategoryEnum.symbols },
    {
      id: CategoryEnum.greetings,
      arabic: 'تحيات',
      english: CategoryEnum.greetings,
    },
    { id: CategoryEnum.time, arabic: 'وقت', english: CategoryEnum.time },
    { id: CategoryEnum.nature, arabic: 'طبيعة', english: CategoryEnum.nature },
    {
      id: CategoryEnum.emotions,
      arabic: 'مشاعر',
      english: CategoryEnum.emotions,
    },
    {
      id: CategoryEnum.clothes,
      arabic: 'ملابس',
      english: CategoryEnum.clothes,
    },
    { id: CategoryEnum.music, arabic: 'موسيقى', english: CategoryEnum.music },
    { id: CategoryEnum.home, arabic: 'منزل', english: CategoryEnum.home },
    { id: CategoryEnum.stones, arabic: 'أحجار', english: CategoryEnum.stones },
    {
      id: CategoryEnum.temples,
      arabic: 'معابد',
      english: CategoryEnum.temples,
    },
    {
      id: CategoryEnum.jobs,
      arabic: this.newProperty,
      english: CategoryEnum.jobs,
    },
    {
      id: CategoryEnum.adjective,
      arabic: 'صفات',
      english: CategoryEnum.adjective,
    },
    { id: CategoryEnum.verb, arabic: 'افعال', english: CategoryEnum.verb },
    {
      id: CategoryEnum.words_in_egyptian_dialect,
      arabic: 'كلمات في العامية',
      english: 'words in egyptians dialect',
    },
    {
      id: CategoryEnum.prepositions,
      arabic: 'حروف الجر',
      english: CategoryEnum.prepositions,
    },
    {
      id: CategoryEnum.insects,
      arabic: 'حشرات',
      english: CategoryEnum.insects,
    },
    {
      id: CategoryEnum.measurements,
      arabic: 'قياسات',
      english: CategoryEnum.measurements,
    },
    {
      id: CategoryEnum.countries,
      arabic: 'دول',
      english: CategoryEnum.countries,
    },
    {
      id: CategoryEnum.egyptian_cities_provinces,
      arabic: 'مدن و محافظات',
      english: 'cities and provinces',
    },
    {
      id: CategoryEnum.fruits_vegetables,
      arabic: 'فواكه و خضراوات',
      english: 'fruits and vegetables',
    },
    { id: CategoryEnum.plants, arabic: 'نباتات', english: CategoryEnum.plants },
    { id: CategoryEnum.cosmos, arabic: 'الكون', english: CategoryEnum.cosmos },
    {
      id: CategoryEnum.female_names,
      arabic: 'أسماء إناث',
      english: 'female names',
    },
    {
      id: CategoryEnum.male_names,
      arabic: 'أسماء ذكور',
      english: 'male names',
    },
    {
      id: CategoryEnum.kings_queens,
      arabic: 'ملوك و ملكات',
      english: 'kings and queens',
    },
  ];

  constructor(private readonly ravendbService: RavendbService) {}

  async findWordsByCategoryId(categoryId: string): Promise<Word[]> {
    const session = this.ravendbService.session();
    const res = (await session
      .query<Word>({ collection: 'word' })
      .whereEquals('category', categoryId)
      .selectFields(['id', 'arabic', 'english', 'egyptian', 'category'])
      .orderBy('egyptian.word')
      .all()) as Word[];
    return res.map((word) => this.toCategoryWordDto(word));
  }

  private categoryEnumAsArray() {
    return this.categories;
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
