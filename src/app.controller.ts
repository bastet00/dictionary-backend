import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  ParseEnumPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LanguageEnum } from './dto/language.enum';
import { CreateWordDto } from './dto/input/create-word.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  create(@Body() createWordDto: CreateWordDto) {
    //TODO: missing functionality
    return 'This action adds a new word';
  }
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
