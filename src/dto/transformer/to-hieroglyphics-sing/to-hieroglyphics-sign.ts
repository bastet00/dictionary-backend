import { singMapper } from './sing-mapper';

const symbolsToReplace: Set<string> = new Set([
  '!',
  '#',
  '&',
  '(',
  ')',
  '*',
  '.',
  '/',
  ':',
  '<',
  '>',
  '[',
  '\\',
  ']',
]);

export const splitGardinerValues = (gardinerValues: string): string[] => {
  const formattedValues = gardinerValues
    .split('')
    .map((char) => (symbolsToReplace.has(char) ? '-' : char))
    .join('')
    .split('-')
    .filter((value) => value);
  return formattedValues;
};
const containsSymbolsToReplace = (gardinerValues: string): boolean => {
  for (const char of gardinerValues) {
    if (symbolsToReplace.has(char) || char === '-') {
      return true;
    }
  }
  return false;
};
export const toHieroglyphicsSign = (gardinerValues: string[]): string[] => {
  return gardinerValues.map((gardinerValue) => {
    if (containsSymbolsToReplace(gardinerValue)) {
      return toHieroglyphicsSign(splitGardinerValues(gardinerValue));
    }
    const hieroglyphicsSign = singMapper[gardinerValue];
    if (!hieroglyphicsSign) {
      return gardinerValue;
    }
    return hieroglyphicsSign;
  });
};
