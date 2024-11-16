import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { WordService } from './word.service';
import { LanguageEnum } from '../dto/language.enum';
import { BulkCreateWordDto, CreateWordDto } from '../dto/input/create-word.dto';
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
   * @param language the language this word written in
   * @returns list of words that match the provided word
   */
  @Get('search')
  search(
    @Query('word', new SanitizeSpecialCharsPipe()) word: string,
    @Query('lang', new ParseEnumPipe(LanguageEnum))
    language: LanguageEnum,
  ) {
    const lang = this.wordService.languageSecretSwitch(word, language);
    return this.wordService.searchAndSuggest(lang, word);
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.wordService.getOne(id);
  }

  @Post()
  create(@Body() createWordDto: CreateWordDto) {
    return this.wordService.create(createWordDto);
  }

  @Post('bulk')
  createBulk(@Body() createWordDto: BulkCreateWordDto) {
    return this.wordService.createBulk(createWordDto);
  }
}
