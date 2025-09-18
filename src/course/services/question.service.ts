import { BadRequestException, Injectable } from '@nestjs/common';
import { DataBaseRepository } from '../db/repository/course.repository';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { Question } from '../db/documents/question.document';

@Injectable()
export class QuestionService {
  constructor(private databaseRepo: DataBaseRepository) {}

  createQuestion(createQuestionDto: CreateQuestionDto) {
    const repo = this.databaseRepo.withSession();
    const now = new Date();

    createQuestionDto.created = now;
    createQuestionDto.updated = now;

    if (!createQuestionDto.tags) {
      createQuestionDto.tags = [];
    }
    const ques = repo.createDocument('question', createQuestionDto);
    repo.save();
    return ques;
  }

  async getQuestions() {
    const repo = this.databaseRepo.withSession();
    const questions = await repo.loadAllOrderKey<Question[]>(
      'question',
      'created',
    );
    if (!questions.founded) {
      throw new BadRequestException('no questions');
    }
    for (const question of questions.result) {
      delete question['@metadata'];
    }
    return questions.result;
  }
}
