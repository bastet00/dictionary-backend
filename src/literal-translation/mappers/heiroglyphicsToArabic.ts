import { arabicToHieroglyphics } from './arabicToHieroglyphics';

let cachedHieroglyphicsToArabic = undefined;
export const hieroglyphicsToArabic = cachedHieroglyphicsToArabic
  ? cachedHieroglyphicsToArabic
  : getHieroglyphicsToArabicMapper();

function getHieroglyphicsToArabicMapper(): LiteralTranslationLangMapper {
  if (cachedHieroglyphicsToArabic) {
    return cachedHieroglyphicsToArabic;
  }

  cachedHieroglyphicsToArabic = {};
  for (const [k, v] of Object.entries(arabicToHieroglyphics)) {
    // avoid overwrite
    if (!cachedHieroglyphicsToArabic[v]) {
      cachedHieroglyphicsToArabic[v] = k;
    }
  }
  return cachedHieroglyphicsToArabic;
}
