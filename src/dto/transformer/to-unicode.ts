import { toUTF32Hex } from 'src/util/utf32-transform';

/**
 *
 * @param param0 symbol to be converted to UTF-32
 * @returns  UTF-32 representation of the symbol
 */
export const toUTF32String = ({ value }) => {
  return toUTF32Hex(value);
};
