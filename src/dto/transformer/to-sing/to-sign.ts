import { singMapper } from './sing-mapper';

export const toSign = (gardinerValues: string[]): string[] => {
  return gardinerValues.map((gardinerValue) => {
    const hieroglyphicsSign = singMapper[gardinerValue];
    if (!hieroglyphicsSign) {
      return gardinerValue;
    }
    return hieroglyphicsSign;
  });
};
