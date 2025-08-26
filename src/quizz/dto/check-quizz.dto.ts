import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';

class UserAnswers {
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @IsNotEmpty()
  @IsInt()
  answerId: number;
}

export class UserAnswersDto {
  @IsArray()
  @IsNotEmpty()
  @Type(() => UserAnswers)
  @ValidateNested({ each: true })
  answers: UserAnswers[];
}
