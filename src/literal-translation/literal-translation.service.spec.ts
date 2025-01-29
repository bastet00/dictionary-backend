import { Test, TestingModule } from '@nestjs/testing';
import { LiteralTranslationService } from './literal-translation.service';

describe('LiteralTranslationService', () => {
  let service: LiteralTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiteralTranslationService],
    }).compile();

    service = module.get<LiteralTranslationService>(LiteralTranslationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should translate Arabic letters to hieroglyphics', () => {
    const word = 'سلام';
    const expectedTranslation = '𓋴𓃭𓄿𓅓'; // Assuming these are the correct hieroglyphics
    expect(
      service.fromArabicLettersToHieroglyphics(word).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should translate Arabic name like Amro to hieroglyphics', () => {
    const word = 'عمرو';
    const expectedTranslation = '𓂝𓅓𓂋𓅱'; // Assuming these are the correct hieroglyphics
    expect(
      service.fromArabicLettersToHieroglyphics(word).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should return the same word if no translation is found', () => {
    const word = 'hello';
    expect(
      service.fromArabicLettersToHieroglyphics(word).literalTranslation,
    ).toBe(word);
  });

  it('should handle empty strings', () => {
    const word = '';
    expect(
      service.fromArabicLettersToHieroglyphics(word).literalTranslation,
    ).toBe(word);
  });

  it('should handle mixed Arabic and non-Arabic letters', () => {
    const word = 'سhelloم';
    const expectedTranslation = '𓋴hello𓅓'; // Assuming these are the correct hieroglyphics
    expect(
      service.fromArabicLettersToHieroglyphics(word).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should return charachtersMapper with the same length as the word', () => {
    const word = 'سلام';
    const charachtersMapper =
      service.fromArabicLettersToHieroglyphics(word).charachtersMapper;
    expect(charachtersMapper.length).toBe(word.length);
  });

  it('should return charachtersMapper with array contains letters  and hieroglyphics', () => {
    const word = 'سلام';
    const charachtersMapper =
      service.fromArabicLettersToHieroglyphics(word).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('س');
    expect(charachtersMapper[1].alphabetCharachters).toBe('ل');
    expect(charachtersMapper[2].alphabetCharachters).toBe('ا');
    expect(charachtersMapper[3].alphabetCharachters).toBe('م');
    // Assuming these are the correct hieroglyphics
    expect(charachtersMapper[0].hieroglyphics).toBe('𓋴');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓃭');
    expect(charachtersMapper[2].hieroglyphics).toBe('𓄿');
    expect(charachtersMapper[3].hieroglyphics).toBe('𓅓');
  });
});
