import { ExerciseDto } from '../dto/create-course.dto';
import { UserAnswerDto } from '../dto/user-answers.dto';
import { Result } from '../types/result.interface';

export abstract class AnswersABC {
  typeName(): string {
    throw new Error('Method "typeName" must be implemented by subclasses.');
  }

  correctnessByType(document: ExerciseDto, userAnswer: UserAnswerDto): Result {
    throw new Error(
      'Method "correctnessByType" must be implemented by subclasses.',
    );
  }

  abstract aid: number;
}
