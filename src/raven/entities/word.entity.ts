export interface Word {
  id: string;
  Arabic: { Word: string }[];
  Egyptian: {
    Word: string;
    Unicode: string;
    Transliteration: string;
    Hieroglyphics: string[];
  }[];
  English: { Word: string }[];
}
