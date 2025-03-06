import { arabicToHieroglyphics } from './arabicToHieroglyphics';

let cachedHieroglyphicsToArabic = undefined;
export const hieroglyphicsToArabic = cachedHieroglyphicsToArabic
  ? cachedHieroglyphicsToArabic
  : getHieroglyphicsToArabicMapper();

function getHieroglyphicsToArabicMapper(): LiteralTranslationLangMapper {
  const swapped = {};
  for (const [k, v] of Object.entries(arabicToHieroglyphics)) {
    // avoid overwrite
    if (!swapped[v]) {
      swapped[v] = k;
    }
  }
  cachedHieroglyphicsToArabic = swapped;
  return cachedHieroglyphicsToArabic;
}
