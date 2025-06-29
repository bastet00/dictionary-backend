import { Test, TestingModule } from '@nestjs/testing';
import { LiteralTranslationService } from './literal-translation.service';
import { GenderEnum } from './dto/gender.enum';
import { LiteralTransLanguageEnum } from './dto/language.enum';

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
    const text = '';
    const expectedTranslation = ''; // Assuming these are the correct hieroglyphics
    expect(
      service.getLiteralTranslation(text, {
        lang: LiteralTransLanguageEnum.arabic,
      }).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should translate Arabic letters to hieroglyphics', () => {
    const text = '';
    const expectedTranslation = ''; // Assuming these are the correct hieroglyphics
    expect(
      service.getLiteralTranslation(text, {
        lang: LiteralTransLanguageEnum.egyptian,
      }).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should translate Arabic letters to hieroglyphics', () => {
    const text = 'سلام';
    const expectedTranslation = '𓋴𓃭𓄿𓅓'; // Assuming these are the correct hieroglyphics
    expect(
      service.getLiteralTranslation(text, {
        lang: LiteralTransLanguageEnum.arabic,
      }).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should translate Arabic name like Amro to hieroglyphics', () => {
    const text = 'عمرو';
    const expectedTranslation = '𓂝𓅓𓂋𓅱'; // Assuming these are the correct hieroglyphics
    expect(
      service.getLiteralTranslation(text, {
        lang: LiteralTransLanguageEnum.arabic,
      }).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should add gender determinative at the end of male name', () => {
    const text = 'عمرو';
    const expectedTranslation = '𓂝𓅓𓂋𓅱𓀀'; // Assuming these are the correct hieroglyphics
    expect(
      service.getLiteralTranslation(text, {
        gender: GenderEnum.MALE,
        lang: LiteralTransLanguageEnum.arabic,
      }).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should add gender determinative at the end of male name', () => {
    const text = 'نفرتيتي';
    const expectedTranslation = '𓄤𓏏𓇌𓏏𓇌𓁐'; // Assuming these are the correct hieroglyphics
    expect(
      service.getLiteralTranslation(text, {
        useMultiLetterSymbols: true,
        gender: GenderEnum.FEMALE,
        lang: LiteralTransLanguageEnum.arabic,
      }).literalTranslation,
    ).toBe(expectedTranslation);
  });

  it('should return the same text if no translation is found', () => {
    const text = 'hello';
    expect(
      service.getLiteralTranslation(text, {
        lang: LiteralTransLanguageEnum.arabic,
      }).literalTranslation,
    ).toBe(text);
  });

  it('should return charachtersMapper with the same length as the text', () => {
    const text = 'سلام';
    const charachtersMapper = service.getLiteralTranslation(text, {
      lang: LiteralTransLanguageEnum.arabic,
    }).lettersMapper;
    expect(charachtersMapper.length).toBe(text.length);
  });

  it('should return charachtersMapper with array contains letters  and hieroglyphics', () => {
    const text = 'سلام';
    const charachtersMapper = service.getLiteralTranslation(text, {
      lang: LiteralTransLanguageEnum.arabic,
    }).lettersMapper;
    expect(charachtersMapper[0].alphabetLetters).toBe('س');
    expect(charachtersMapper[1].alphabetLetters).toBe('ل');
    expect(charachtersMapper[2].alphabetLetters).toBe('ا');
    expect(charachtersMapper[3].alphabetLetters).toBe('م');
    // Assuming these are the correct hieroglyphics
    expect(charachtersMapper[0].hieroglyphics).toBe('𓋴');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓃭');
    expect(charachtersMapper[2].hieroglyphics).toBe('𓄿');
    expect(charachtersMapper[3].hieroglyphics).toBe('𓅓');
  });

  it('Should match single letter if no prefix founded', () => {
    const text = 'نفرتيتي';
    const charachtersMapper = service.getLiteralTranslation(
      text,
      { useMultiLetterSymbols: true, lang: LiteralTransLanguageEnum.arabic }, // enable multi-sound query
    ).lettersMapper;
    expect(charachtersMapper[0].alphabetLetters).toBe('نفر');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓄤');
  });

  it('Should match entire text if a full match exists', () => {
    const text = 'عنخ';
    const charachtersMapper = service.getLiteralTranslation(text, {
      useMultiLetterSymbols: true,
      lang: LiteralTransLanguageEnum.arabic,
    }).lettersMapper;
    expect(charachtersMapper[0].alphabetLetters).toBe('عنخ');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓋹');
  });

  it('Should match signle letter at first, combine last three letters', () => {
    const text = 'كتابعنخ';
    const charachtersMapper = service.getLiteralTranslation(text, {
      useMultiLetterSymbols: true,
      lang: LiteralTransLanguageEnum.arabic,
    }).lettersMapper;
    expect(charachtersMapper[0].alphabetLetters).toBe('ك');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓎡');
    expect(charachtersMapper[1].alphabetLetters).toBe('ت');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓏏');
    expect(charachtersMapper[2].alphabetLetters).toBe('اب');
    expect(charachtersMapper[2].hieroglyphics).toBe('𓍋');
    expect(charachtersMapper[3].alphabetLetters).toBe('عنخ');
    expect(charachtersMapper[3].hieroglyphics).toBe('𓋹');
  });

  it('Should match first two letters,single one at the end', () => {
    const text = 'نور';
    const charachtersMapper = service.getLiteralTranslation(text, {
      useMultiLetterSymbols: true,
      lang: LiteralTransLanguageEnum.arabic,
    }).lettersMapper;
    expect(charachtersMapper[0].alphabetLetters).toBe('نو');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓏌');
    expect(charachtersMapper[1].alphabetLetters).toBe('ر');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓂋');
  });

  it('should match 3,2,1 letters', () => {
    const text = 'كتعنخنوكت';
    const charachtersMapper = service.getLiteralTranslation(text, {
      useMultiLetterSymbols: true,
      lang: LiteralTransLanguageEnum.arabic,
    }).lettersMapper;
    expect(charachtersMapper[0].alphabetLetters).toBe('ك');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓎡');
    expect(charachtersMapper[1].alphabetLetters).toBe('ت');
    expect(charachtersMapper[1].hieroglyphics).toBe('𓏏');
    expect(charachtersMapper[2].alphabetLetters).toBe('عنخ');
    expect(charachtersMapper[2].hieroglyphics).toBe('𓋹');
    expect(charachtersMapper[3].alphabetLetters).toBe('نو');
    expect(charachtersMapper[3].hieroglyphics).toBe('𓏌');
  });

  it('should handle spaces between words in arabic', () => {
    const text = 'نو ر';
    const charachtersMapper = service.getLiteralTranslation(text, {
      useMultiLetterSymbols: true,
      lang: LiteralTransLanguageEnum.arabic,
    }).lettersMapper;
    expect(charachtersMapper[0].alphabetLetters).toBe('نو');
    expect(charachtersMapper[0].hieroglyphics).toBe('𓏌');
    expect(charachtersMapper[1].hieroglyphics).toBe(' ');
    expect(charachtersMapper[2].alphabetLetters).toBe('ر');
    expect(charachtersMapper[2].hieroglyphics).toBe('𓂋');
  });

  it('should parse special charachters to itself', () => {
    const text = '!@#$%^&*()_-';
    const charachtersMapper = service.getLiteralTranslation(text, {
      useMultiLetterSymbols: true,
      lang: LiteralTransLanguageEnum.arabic,
    }).literalTranslation;
    expect(charachtersMapper).toBe(text);
  });

  it('should translate from hiero to arabic', () => {
    const text = '𓈙𓅓𓋴 𓄿𓃭𓊃𓈖𓄿𓏏𓇌';
    const charachtersMapper = service.getLiteralTranslation(text, {
      lang: LiteralTransLanguageEnum.egyptian,
    }).literalTranslation;
    expect(charachtersMapper).toBe('شمس ألزنأتي'); // ا -> أ
  });

  it('should return same amount of spaces', () => {
    const text = '𓇌𓅱𓋴𓆑 𓃀𓇌𓎛𓃀 𓂧𓉻𓇋𓀀';

    const charachtersMapper = service.getLiteralTranslation(text, {
      lang: LiteralTransLanguageEnum.egyptian,
    });
    let spaces = 0;
    charachtersMapper.lettersMapper.forEach((obj) => {
      if (obj.alphabetLetters === ' ') {
        spaces++;
      }
    });
    expect(spaces).toEqual(2);
  });

  it('should handle spaces between words in english', () => {
    const text = 'wn r';
    const charachtersMapper = service.getLiteralTranslation(text, {
      useMultiLetterSymbols: true,
      lang: LiteralTransLanguageEnum.arabic,
    }).lettersMapper;
    expect(charachtersMapper[0].alphabetLetters).toBe('wn');
    console.log(charachtersMapper[0].hieroglyphics);
    expect(charachtersMapper[0].hieroglyphics).toBe('𓃹');
    expect(charachtersMapper[1].hieroglyphics).toBe(' ');
    expect(charachtersMapper[2].alphabetLetters).toBe('r');
    expect(charachtersMapper[2].hieroglyphics).toBe('𓂋');
  });

  it('should translate 3 letters in english to triliteral sign', () => {
    const text = 'ank';
    const charachtersMapper = service.getLiteralTranslation(text, {
      useMultiLetterSymbols: true,
      lang: LiteralTransLanguageEnum.arabic,
    });
    expect(charachtersMapper.literalTranslation).toBe('𓋹');

    const text2 = '3nk';
    const charachtersMapper2 = service.getLiteralTranslation(text2, {
      useMultiLetterSymbols: true,
      lang: LiteralTransLanguageEnum.arabic,
    });
    expect(charachtersMapper2.literalTranslation).toBe('𓋹');
  });
});
