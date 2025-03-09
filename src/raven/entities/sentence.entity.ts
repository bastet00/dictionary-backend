export interface Sentence {
  id: string;
  arabic: string;
  english: string;
  hieroglyphic?: string;
  transliteration: string;
  egyptian: string;
  resource: string;
  british?: string;
  german?: string;
  '@metadata'?: { '@id': string };
}
