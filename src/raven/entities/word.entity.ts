import { CategoryEnum } from 'src/category/dto/category.enum';

export interface Word {
  id: string;
  resources?: string[];
  arabic: { word: string }[];
  egyptian: {
    word: string;
    symbol: string;
    transliteration: string;
    hieroglyphics: string[];
  }[];
  english: { word: string }[];
  category: CategoryEnum[];
  createdAt?: string;
  updatedAt?: string;
  '@metadata'?: { '@id': string };
}

export interface WordDetailDto extends Word {
  egyptian: {
    word: string;
    symbol: string;
    transliteration: string;
    hieroglyphics: string[];
    hieroglyphicSigns: string[];
  }[];
}
