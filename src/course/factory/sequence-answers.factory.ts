import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { AnswersABC } from './answers.abs';
import { ExerciseDto } from '../dto/create-course.dto';
import { UserAnswerDto } from '../dto/user-answers.dto';
import { Result } from '../types/result.interface';

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

  correctnessByType(document: ExerciseDto, userAnswer: UserAnswerDto): Result {
    const rightOrder = document.answers.map(
      (obj: SequenceAnswers) => obj.order,
    );
    console.log(rightOrder);

    return {} as Result;
  }
}
