import { BadRequestException } from '@nestjs/common';
import { SanitizeSpecialCharsPipe } from './sanitizeSymbolPipe';

describe('SanitizeSpecialCharsPipe', () => {
  let pipe: SanitizeSpecialCharsPipe;

  beforeEach(() => {
    pipe = new SanitizeSpecialCharsPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return arabic english letters', () => {
    const result = pipe.transform('dasيسشيشس()');
    expect(result).toBe('dasيسشيشس');
  });

  it('should return empty string', () => {
    const result = pipe.transform('!@#$%^&*()[]{}');
    expect(result).toBe('');
  });

  it('should return arabic,english,numbers and spaces', () => {
    const result = pipe.transform('^#$%@#$[]{}()  mm   يي 12');
    expect(result).toBe('  mm   يي 12');
  });

  it('should throw 400 error', () => {
    expect(() => pipe.transform('')).toThrow(BadRequestException);
  });

  it('should throw 400 error', () => {
    expect(() => pipe.transform(null)).toThrow(BadRequestException);
  });
});
