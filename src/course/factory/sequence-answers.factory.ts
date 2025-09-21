import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { AnswersABC } from './answers.abs';

export class SequenceAnswers implements AnswersABC {
  @IsInt()
  @Min(1)
  order: number;

  @IsString()
  @IsNotEmpty()
  answer: string;

  aid: number;

  typeName(): string {
    return 'sequence';
  }
}
