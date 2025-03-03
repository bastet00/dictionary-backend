import { LiteralTransLanguageEnum } from './language.enum';

type LiteralTranslationObject = {
  [key: string]: string;
};

export type LiteralTranslationObjects = {
  [key in LiteralTransLanguageEnum]: LiteralTranslationObject;
};
