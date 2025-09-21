import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { AnswersABC } from './answers.abs';

export class McqAnswers implements AnswersABC {
  @IsBoolean()
  isAnswer: boolean;
  @IsString()
  @IsNotEmpty()
  answer: string;

  aid: number;
  typeName(): string {
    return 'mcq';
  }
}
