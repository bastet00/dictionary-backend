import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminWordService } from './admin.word.service';
import { LanguageEnum } from 'src/dto/language.enum';
import { LoginGuard } from 'src/common/guards/login.guard';
import { UpdateWordDto } from 'src/dto/input/update-word.dto';
import { DefaultMinMaxValue } from 'src/common/custom-decorators/NumericalOrDefault';

@Controller('admin')
export class AdminWordController {
  constructor(private readonly adminService: AdminWordService) {}

  @Get()
  @UseGuards(LoginGuard)
  search(
    @DefaultMinMaxValue({ key: 'page', default: 1, min: false }) page: number,
    @DefaultMinMaxValue({ key: 'per_page', default: 100, min: true })
    perPage: number,
    @Query('word') word: string,
    @Query(
      'lang',
      new DefaultValuePipe('Egyptian'),
      new ParseEnumPipe(LanguageEnum),
    )
    lang: LanguageEnum,
  ) {
    return this.adminService.search(page, perPage, word, lang);
  }

  @Delete(':id')
  @UseGuards(LoginGuard)
  delete(@Param('id') id: string) {
    return this.adminService.delete(id);
  }

  @Put(':id')
  @UseGuards(LoginGuard)
  patch(@Param('id') id: string, @Body() updateWordDto: UpdateWordDto) {
    return this.adminService.patch(id, updateWordDto);
  }
}
