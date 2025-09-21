import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '../db/repository/question.repository';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { Question } from '../db/documents/question.document';

@Injectable()
export class QuestionService {
  constructor(private questionRepository: QuestionRepository) {}

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const questionData: Omit<Question, 'id' | 'created' | 'updated'> = {
      question: createQuestionDto.question,
      type: createQuestionDto.type,
      answer: createQuestionDto.answer,
      tags: createQuestionDto.tags || [],
    };

    return this.questionRepository.createQuestion(questionData);
  }

  async getQuestions(): Promise<Question[]> {
    return await this.questionRepository.findAllByCreated();
  }
}
