import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { AnswersABC } from './answers.abs';
import { ExerciseDto } from '../dto/create-course.dto';
import { UserAnswerDto } from '../dto/user-answers.dto';
import { Result } from '../types/result.interface';
import { BadRequestException } from '@nestjs/common';

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
    try {
      const rightOrder = document.answers.map((obj: SequenceAnswers, i) => {
        if (!userAnswer.order[i]) {
          throw new Error();
        }
        console.log(`comapring ${obj.order} with ${userAnswer.order[i]}`);
        return obj.order === userAnswer.order[i];
      });

      return {
        qid: document.qid,
        question: document.question,
        userAnswer: userAnswer.order,
        isCorrect: !rightOrder.some((bool) => !bool),
      };
    } catch {
      throw new BadRequestException(
        'order is less than required number of orders',
      );
    }
  }
}
