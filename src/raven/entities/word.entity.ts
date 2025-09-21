import { CategoryEnum } from 'src/category/dto/category.enum';

export type WordValue = { word: string };

export interface Word {
  id: string;
  resources?: string[];
  arabic: WordValue[];
  egyptian: {
    word: string;
    symbol: string;
    transliteration: string;
    hieroglyphics: string[];
  }[];
  english: WordValue[];
  category?: CategoryEnum[];
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
