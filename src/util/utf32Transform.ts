function toHexString(num: number) {
  return num.toString(16).padStart(8, '0').toUpperCase();
}

export function toUTF32Hex(symbol: string) {
  const codePoint = symbol.codePointAt(0);
  return toHexString(codePoint); // without 0x
}
