import { isArray } from 'class-validator';
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
  if (
    isArray(gardinerValues) &&
    gardinerValues.length > 0 &&
    containsSymbolsToReplace(gardinerValues[0])
  ) {
    return toHieroglyphicsSign(splitGardinerValues(gardinerValues[0]));
  }
  return gardinerValues.map((gardinerValue) => {
    const hieroglyphicsSign = singMapper[gardinerValue];
    if (!hieroglyphicsSign) {
      return gardinerValue;
    }
    return hieroglyphicsSign;
  });
};
