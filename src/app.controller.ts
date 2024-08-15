import {
  Controller,
  Get,
  ParseEnumPipe,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LanguageEnum } from './dto/language.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 
   * @param word the word to be translated
   * @param language the language this word written in
   * @returns list of words that match the provided word
   */
  @Get()
  search(
    @Query('word') word: string,
    @Query('lang', new ParseEnumPipe(LanguageEnum)) language: LanguageEnum,
  ) {
    return this.appService.search(language, word);
  }
}
