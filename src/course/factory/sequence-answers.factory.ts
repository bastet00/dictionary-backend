import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { AnswersABC } from './answers.abs';
import { QuestionType } from '../db/documents/question.document';

export class SequenceAnswers implements AnswersABC {
  @IsInt()
  @Min(1)
  order: number;

  @IsString()
  @IsNotEmpty()
  answer: string;

  aid: number;

  typeName(): string {
    return QuestionType.SEQUENCE;
  }
}
