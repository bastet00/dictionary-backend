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
import { WordService } from './word.service';
import { LanguageEnum } from '../dto/language.enum';
import { BulkCreateWordDto, CreateWordDto } from '../dto/input/create-word.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('word')
export class WordController {
  constructor(private readonly appService: WordService) {}

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
   * @param language the language this word written in
   * @returns list of words that match the provided word
   */
  @Get('search')
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
  createBulk(@Body() createWordDto: BulkCreateWordDto) {
    return this.appService.createBulk(createWordDto);
  }
}
