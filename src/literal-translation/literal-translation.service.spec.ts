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
    expect(service.fromArabicLettersToHieroglyphics(word)).toBe(
      expectedTranslation,
    );
  });

  it('should translate Arabic name like Amro to hieroglyphics', () => {
    const word = 'عمرو';
    const expectedTranslation = '𓂝𓅓𓂋𓅱'; // Assuming these are the correct hieroglyphics
    expect(service.fromArabicLettersToHieroglyphics(word)).toBe(
      expectedTranslation,
    );
  });

  it('should return the same word if no translation is found', () => {
    const word = 'hello';
    expect(service.fromArabicLettersToHieroglyphics(word)).toBe(word);
  });

  it('should handle empty strings', () => {
    const word = '';
    expect(service.fromArabicLettersToHieroglyphics(word)).toBe(word);
  });

  it('should handle mixed Arabic and non-Arabic letters', () => {
    const word = 'سhelloم';
    const expectedTranslation = '𓋴hello𓅓'; // Assuming these are the correct hieroglyphics
    expect(service.fromArabicLettersToHieroglyphics(word)).toBe(
      expectedTranslation,
    );
  });
});
