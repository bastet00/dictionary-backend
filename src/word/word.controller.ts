import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { WordService } from './word.service';
import { LanguageEnum } from '../dto/language.enum';
import { SanitizeSpecialCharsPipe } from 'src/common/custom-pipes/sanitizeSymbolPipe';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  /**
   * Health check endpoint
   * @returns Hello World
   */
  @Get()
  helloWorld() {
    return 'Hello World';
  }

  /**
   * @param word the word to be translated
   * @param lang the language this word written in
   * @returns list of words that match the provided word
   */
  @Get('search')
  search(
    @Query('word', new SanitizeSpecialCharsPipe()) word: string,
    @Query('lang', new ParseEnumPipe(LanguageEnum))
    language: LanguageEnum,
  ) {
    const lang = this.wordService.languageSecretSwitch(word, language);
    if (lang === LanguageEnum.english) {
      return this.wordService.vectorSimilaritySearch(lang, word);
    }
    return this.wordService.searchAndSuggest(lang, word);
  }

  //TODO: rename to search with version
  @Get('similarity-search')
  similaritySearch(
    @Query('text', new SanitizeSpecialCharsPipe()) text: string,
    @Query('lang', new ParseEnumPipe(LanguageEnum, { optional: true }))
    language: LanguageEnum = LanguageEnum.english,
  ) {
    return this.wordService.vectorSimilaritySearch(language, text);
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.wordService.getOne(id);
  }
}
