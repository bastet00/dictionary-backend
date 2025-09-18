import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { QuestionService } from '../services/question.service';

@Controller('api/v1/question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  // TODO: create a controller for question
  @Post()
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.createQuestion(createQuestionDto);
  }

  @Get()
  getQuestions() {
    return this.questionService.getQuestions();
  }
}
