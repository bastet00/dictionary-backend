import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { QuestionService } from '../services/question.service';
import { LoginGuard } from '../../common/guards/login.guard';

@Controller('api/v1/question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @UseGuards(LoginGuard)
  @Post()
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.createQuestion(createQuestionDto);
  }

  @Get()
  getQuestions() {
    return this.questionService.getQuestions();
  }
}
