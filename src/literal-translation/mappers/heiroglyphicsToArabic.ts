import { arabicToHieroglyphics } from './arabicToHieroglyphics';

export function getHeiroToArabicObject() {
  const swapped = {};
  for (const [k, v] of Object.entries(arabicToHieroglyphics)) {
    // avoid overwrite
    if (!swapped[v]) {
      swapped[v] = k;
    }
  }
  return swapped;
}
