export interface Word {
  id: string;
  resources?: string[];
  arabic: { word: string }[];
  egyptian: {
    word: string;
    unicode: string;
    transliteration: string;
    hieroglyphics: string[];
  }[];
  english: { word: string }[];
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
('');
