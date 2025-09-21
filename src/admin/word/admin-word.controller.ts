import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminWordService } from './admin-word.service';
import { LanguageEnum } from 'src/dto/language.enum';
import { LoginGuard } from 'src/common/guards/login.guard';
import { DefaultMinMaxValue } from 'src/common/custom-decorators/NumericalOrDefault';
import { UpdateWordDto } from './dto/update-word.dto';
import { CreateWordDto } from 'src/dto/input/word/create-word.dto';

@Controller('admin/word')
export class AdminWordController {
  constructor(private readonly adminService: AdminWordService) {}

  @Get()
  @UseGuards(LoginGuard)
  search(
    @DefaultMinMaxValue({ key: 'page', default: 1, min: false }) page: number,
    @DefaultMinMaxValue({ key: 'perPage', default: 100, min: true })
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

  @Post()
  @UseGuards(LoginGuard)
  create(@Body() createWordDto: CreateWordDto) {
    return this.adminService.create(createWordDto);
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
