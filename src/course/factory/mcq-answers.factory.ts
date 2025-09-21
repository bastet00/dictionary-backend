import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { AnswersABC } from './answers.abs';
import { QuestionType } from '../db/documents/question.document';

export class McqAnswers implements AnswersABC {
  @IsBoolean()
  isAnswer: boolean;
  @IsString()
  @IsNotEmpty()
  answer: string;

  aid: number;
  typeName(): string {
    return QuestionType.MCQ;
  }
}
