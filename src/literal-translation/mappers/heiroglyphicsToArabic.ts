import { arabicToHieroglyphics } from './arabicToHieroglyphics';

export let hieroglyphicsToArabic = undefined;
hieroglyphicsToArabic = hieroglyphicsToArabic
  ? hieroglyphicsToArabic
  : getHieroglyphicsToArabicMapper();

function getHieroglyphicsToArabicMapper(): LiteralTranslationLangMapper {
  const swapped = {};
  for (const [k, v] of Object.entries(arabicToHieroglyphics)) {
    // avoid overwrite
    if (!swapped[v]) {
      swapped[v] = k;
    }
  }
  return swapped;
}
