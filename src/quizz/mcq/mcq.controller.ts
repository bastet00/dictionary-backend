import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { CreateMcqDto } from '../dto/create-question.dto';
import { QuestionTypesEnum } from '../dto/quizz-types.dto';
import { McqService } from './mcq.service';
// import { LoginGuard } from 'src/common/guards/login.guard';
import { UserAnswersDto } from '../dto/check-quizz.dto';

@Controller('mcq')
export class McqController {
  constructor(private readonly mcqService: McqService) {}

  @Post()
  // @UseGuards(LoginGuard)
  createQuestion(@Body() createMcqDto: CreateMcqDto) {
    return this.mcqService.createQuestion(createMcqDto);
  }

  @Get()
  getQuizz(
    @Query('level', new ParseIntPipe()) lvl: number,
    @Query('section', new ParseIntPipe()) section: number,
    @Query('type') type: QuestionTypesEnum,
  ) {
    return this.mcqService.getQuizz({ lvl, section, type });
  }

  @Post('check/:id')
  checkQuizzAnswers(
    @Param('id') quizzId: string,
    @Body() userAnswersDto: UserAnswersDto,
  ) {
    return this.mcqService.checkQuizzAnswers(userAnswersDto, quizzId);
  }
}
