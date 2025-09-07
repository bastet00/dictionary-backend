import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { AnswersABC } from './answers.abs';
import { ExerciseDto } from '../dto/create-course.dto';
import { UserAnswerDto } from '../dto/user-answers.dto';
import { Result } from '../types/result.interface';

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

  correctnessByType(document: ExerciseDto, userAnswer: UserAnswerDto): Result {
    const isCorrect = document.answers.some(
      (obj) => obj.aid === userAnswer.aid,
    );

    if (isCorrect) {
      return {
        qid: document.qid,
        question: document.question,
        userAnswer: userAnswer.aid,
        isCorrect: isCorrect,
      };
    }
  }
}
