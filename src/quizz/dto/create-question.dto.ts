import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QuestionTypesEnum } from './quizz-types.dto';

const minAnswerPerQuestion = 3;
const minQuestionsPerQuizz = 5;

class Level {
  @IsInt()
  @IsNotEmpty()
  level: number;
  @IsInt()
  section: number;
  @IsInt()
  lesson: number;
}

class Question {
  @ValidateNested({ each: true })
  @Type(() => Level)
  @IsObject()
  info: Level;
  @IsString()
  @IsNotEmpty()
  lessonName: string;
  @IsEnum(QuestionTypesEnum)
  type: QuestionTypesEnum;
}

export class McqDto {
  qId: number;

  @IsString()
  @IsNotEmpty()
  question: string;

  @Type(() => McqAnswer)
  @ValidateNested({ each: true })
  @ArrayMinSize(minAnswerPerQuestion)
  answers: McqAnswer[];
}

export class McqAnswer {
  @IsBoolean()
  isAnswer: boolean;
  @IsString()
  @IsNotEmpty()
  answer: string;
  aId: number;
}

export class CreateMcqDto extends Question {
  @ValidateNested({ each: true })
  @Type(() => McqDto)
  @ArrayMinSize(minQuestionsPerQuizz)
  quizz: McqDto[];
}
