import { Test, TestingModule } from '@nestjs/testing';
import { LiteralTranslationService } from './literal-translation.service';
import { GenderEnum } from './dto/gender.enum';

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
    const text = 'سلام';
    const expectedTranslation = '𓋴𓃭𓄿𓅓'; // Assuming these are the correct hieroglyphics
    expect(
      service.fromArabicLettersToHieroglyphics(text).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should translate Arabic name like Amro to hieroglyphics', () => {
    const text = 'عمرو';
    const expectedTranslation = '𓂝𓅓𓂋𓅱'; // Assuming these are the correct hieroglyphics
    expect(
      service.fromArabicLettersToHieroglyphics(text).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should add gender determinative at the end of male name', () => {
    const text = 'عمرو';
    const expectedTranslation = '𓂝𓅓𓂋𓅱𓀀'; // Assuming these are the correct hieroglyphics
    expect(
      service.fromArabicLettersToHieroglyphics(text, {
        gender: GenderEnum.MALE,
      }).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should add gender determinative at the end of male name', () => {
    const text = 'نفرتيتي';
    const expectedTranslation = '𓄤𓏏𓇌𓏏𓇌𓁐'; // Assuming these are the correct hieroglyphics
    expect(
      service.fromArabicLettersToHieroglyphics(text, {
        multiSoundSymbol: true,
        gender: GenderEnum.FEMALE,
      }).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should return the same text if no translation is found', () => {
    const text = 'hello';
    expect(
      service.fromArabicLettersToHieroglyphics(text).literalTranslation,
    ).toBe(text);
  });

  it('should handle empty strings', () => {
    const text = '';
    expect(
      service.fromArabicLettersToHieroglyphics(text).literalTranslation,
    ).toBe(text);
  });

  it('should return charachtersMapper with the same length as the text', () => {
    const text = 'سلام';
    const charachtersMapper =
      service.fromArabicLettersToHieroglyphics(text).charachtersMapper;
    expect(charachtersMapper.length).toBe(text.length);
  });

  it('should return charachtersMapper with array contains letters  and hieroglyphics', () => {
    const text = 'سلام';
    const charachtersMapper =
      service.fromArabicLettersToHieroglyphics(text).charachtersMapper;
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
    const text = 'نفرتيتي';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(
      text,
      { multiSoundSymbol: true }, // enable multi-sound query
    ).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('نفر');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓄤');
  });

  it('Should match entire text if a full match exists', () => {
    const text = 'عنخ';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(text, {
      multiSoundSymbol: true,
    }).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('عنخ');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓂀');
  });

  it('Should match signle letter at first, combine last three letters', () => {
    const text = 'كتابعنخ';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(text, {
      multiSoundSymbol: true,
    }).charachtersMapper;
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
    const text = 'نور';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(text, {
      multiSoundSymbol: true,
    }).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('نو');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓌝');
    expect(charachtersMapper[1].alphabetCharachters).toBe('ر');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓂋');
  });

  it('should match 3,2,1 letters', () => {
    const text = 'كتعنخنوكت';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(text, {
      multiSoundSymbol: true,
    }).charachtersMapper;
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
    const text = 'نو ر';
    const charachtersMapper = service.fromArabicLettersToHieroglyphics(text, {
      multiSoundSymbol: true,
    }).charachtersMapper;
    expect(charachtersMapper[0].alphabetCharachters).toBe('نو');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓌝');
    expect(charachtersMapper[1].alphabetCharachters).toBe('ر');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓂋');
  });
});
