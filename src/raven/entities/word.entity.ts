export type WordValue = { word: string };
export interface Word {
  id: string;
  resources?: string[];
  arabic: WordValue[];
  egyptian: {
    word: string;
    unicode: string;
    transliteration: string;
    hieroglyphics: string[];
  }[];
  english: WordValue[];
  '@metadata'?: { '@id': string };
}

export interface WordDetailDto extends Word {
  egyptian: {
    word: string;
    unicode: string;
    transliteration: string;
    hieroglyphics: string[];
    hieroglyphicSigns: string[];
  }[];
}
