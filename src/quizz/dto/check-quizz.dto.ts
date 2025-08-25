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

// COMMENT:
// user send on /quizzId [ {questionId: 1, answerId:2}, {questionId: 2, answerId:3} ]
// get question id check its answers check if the object with answerId has IsAnswer true
