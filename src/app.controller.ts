import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LanguageEnum } from './dto/language.enum';
import { BulkCreateWordDto, CreateWordDto } from './dto/input/create-word.dto';
import { LoginGuard } from './common/guards/login.guard';
import { UpdateWordDto } from './dto/input/update-word.dto';
import { request } from 'http';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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

  @Delete(':id')
  @UseGuards(LoginGuard)
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.appService.delete(id);
  }

  @Put(':id')
  @UseGuards(LoginGuard)
  patch(@Param('id') id: string, @Body() updateWordDto: UpdateWordDto) {
    return this.appService.patch(id, updateWordDto);
  }
}
