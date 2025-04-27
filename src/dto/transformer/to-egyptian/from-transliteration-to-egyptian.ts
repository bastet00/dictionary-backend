export const computerTransliterationToEgyptian = {
  '.': '',
  ' ': ' ',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '0': '0',
  '(': '(',
  ')': ')',
  '[': '[',
  ']': ']',
  '?': '?',
  '-': '-',
  A: 'ا',
  i: 'إ',
  y: 'ي',
  w: 'و',
  b: 'ب',
  p: 'پ',
  a: 'ع',
  t: 'ت',
  T: 'ث',
  m: 'م',
  f: 'ف',
  n: 'ن',
  r: 'ر',
  h: 'ه',
  H: 'ح',
  s: 'س',
  S: 'ش',
  l: 'ل',
  x: 'خ',
  X: 'غ',
  z: 'ز',
  q: 'ق',
  k: 'ك',
  g: 'چ',
  d: 'د',
  D: 'ج',
  '=': '=',
  ',': ',',
};

export const fromTransliterationToEgyptian = ({ value }: { value: string }) => {
  return value
    .split('')
    .map((char) => {
      return computerTransliterationToEgyptian[char] || char;
    })
    .join('');
};
