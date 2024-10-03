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
import { AdminService } from './admin.service';
import { LanguageEnum } from 'src/dto/language.enum';
import { LoginGuard } from 'src/common/guards/login.guard';
import { UpdateWordDto } from 'src/dto/input/update-word.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @UseGuards(LoginGuard)
  search(
    @Query('page') page: string = '1',
    @Query('per_page') perPage: string = '100',
    @Query('word') word: string,
    @Query(
      'lang',
      new DefaultValuePipe('Egyptian'),
      new ParseEnumPipe(LanguageEnum),
    )
    lang: LanguageEnum,
  ) {
    return this.adminService.search(+page, +perPage, word, lang);
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
