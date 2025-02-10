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

  it('Should match single letter if no prefix founded', () => {
    const word = 'نفرتيتي';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(
      word,
      true, // enable multi-sound query
    ).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('نفر');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓄤');
  });

  it('Should match entire word if a full match exists', () => {
    const word = 'عنخ';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(
      word,
      true,
    ).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('عنخ');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓂀');
  });

  it('Should match signle letter at first, combine last three letters', () => {
    const word = 'كتابعنخ';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(
      word,
      true,
    ).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('ك');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓎡');
    expect(charachtersMapper[1].alphabetCharachters).toBe('ت');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓏏');
    expect(charachtersMapper[2].alphabetCharachters).toBe('ا');
    expect(charachtersMapper[2].hieroglyphics).toBe('𓄿');
    expect(charachtersMapper[3].alphabetCharachters).toBe('ب');
    expect(charachtersMapper[3].hieroglyphics).toBe('𓃀');
    expect(charachtersMapper[4].alphabetCharachters).toBe('عنخ');
    expect(charachtersMapper[4].hieroglyphics).toBe('𓂀');
  });

  it('Should match first two letters,single one at the end', () => {
    const word = 'نور';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(
      word,
      true,
    ).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('نو');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓌝');
    expect(charachtersMapper[1].alphabetCharachters).toBe('ر');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓂋');
  });

  it('should match 3,2,1 letters', () => {
    const word = 'كتعنخنوكت';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(
      word,
      true,
    ).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('ك');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓎡');
    expect(charachtersMapper[1].alphabetCharachters).toBe('ت');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓏏');
    expect(charachtersMapper[2].alphabetCharachters).toBe('عنخ');
    expect(charachtersMapper[2].hieroglyphics).toBe('𓂀');
    expect(charachtersMapper[3].alphabetCharachters).toBe('نو');
    expect(charachtersMapper[3].hieroglyphics).toBe('𓌝');
  });

  it('should handle spaces between words', () => {
    const word = 'نو ر';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(
      word,
      true,
    ).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('نو');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓌝');
    expect(charachtersMapper[1].alphabetCharachters).toBe('ر');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓂋');
  });
});
