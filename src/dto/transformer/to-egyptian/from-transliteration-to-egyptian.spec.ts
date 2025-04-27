import { fromTransliterationToEgyptian } from './from-transliteration-to-egyptian';

describe('fromTransliterationToEgyptian', () => {
  it('should convert transliteration to Egyptian characters', () => {
    const result = fromTransliterationToEgyptian({ value: 'Abi' });
    expect(result).toBe('ابإ');
  });

  it('should convert transliteration to Egyptian characters', () => {
    const result = fromTransliterationToEgyptian({ value: 'Abi-a' });
    expect(result).toBe('ابإ-ع');
  });

  it('should handle numbers and special characters correctly', () => {
    const result = fromTransliterationToEgyptian({ value: '123?' });
    expect(result).toBe('123?');
  });

  it('should return the same string if no mapping exists for characters', () => {
    const result = fromTransliterationToEgyptian({ value: 'Z!' });
    expect(result).toBe('Z!');
  });

  it('should handle an empty string', () => {
    const result = fromTransliterationToEgyptian({ value: '' });
    expect(result).toBe('');
  });

  it('should handle mixed valid and invalid characters', () => {
    const result = fromTransliterationToEgyptian({ value: 'A1b!' });
    expect(result).toBe('ا1ب!');
  });

  it('should handle spaces correctly', () => {
    const result = fromTransliterationToEgyptian({ value: 'A b' });
    expect(result).toBe('ا ب');
  });

  it('should handle parentheses and brackets correctly', () => {
    const result = fromTransliterationToEgyptian({ value: '(A)[b]' });
    expect(result).toBe('(ا)[ب]');
  });
});
