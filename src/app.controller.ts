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
import { CreateSuggetionDto } from './dto/input/suggest-word.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  /**
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

  @Post()
  create(@Body() createWordDto: CreateWordDto) {
    return this.appService.create(createWordDto);
  }

  @Post('bulk')
  createBulk(@Body() createWordDto: CreateWordDto[]) {
    return this.appService.createBulk(createWordDto);
  }

  @Post('word-suggestion')
  createUserWord(@Body() createSuggetionDto: CreateSuggetionDto) {
    return this.appService.createUserWord(createSuggetionDto);
  }
}
