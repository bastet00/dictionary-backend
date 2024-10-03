export interface Word {
  id: string;
  arabic: { word: string }[];
  egyptian: {
    word: string;
    unicode: string;
    transliteration: string;
    hieroglyphics: string[];
  }[];
  english: { word: string }[];
}
