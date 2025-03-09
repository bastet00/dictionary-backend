import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminSentenceService } from './admin-sentence.service';
import {
  BulkCreateSentenceDto,
  CreateSentenceDto,
} from './dto/create-sentence.dto';
import { LoginGuard } from '../../common/guards/login.guard';

@Controller('api/v1/admin/sentence')
export class AdminSentenceController {
  constructor(private readonly adminSentenceService: AdminSentenceService) {}

  @UseGuards(LoginGuard)
  @Post()
  create(@Body() createWordDto: CreateSentenceDto) {
    return this.adminSentenceService.create(createWordDto);
  }

  @UseGuards(LoginGuard)
  @Post('bulk')
  createBulk(@Body() createWordDto: BulkCreateSentenceDto) {
    return this.adminSentenceService.createBulk(createWordDto);
  }
}
