import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LanguageEnum } from 'src/dto/language.enum';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  search(
    @Query('page') page: string,
    @Query('per_page') perPage: string,
    @Query('lang', new ParseEnumPipe(LanguageEnum)) lang: LanguageEnum,
  ) {
    return 'Hello world';
  }
}
