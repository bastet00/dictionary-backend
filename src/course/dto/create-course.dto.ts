import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { AnswersFactory, ExerciseTypes } from '../factory/factory';
import { Type } from 'class-transformer';
import { UnprocessableEntityException } from '@nestjs/common';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseTitle: string;

  @IsInt()
  @Min(1)
  courseLevel: number;

  @IsInt()
  @Min(1)
  unitNum: number;

  @IsString()
  @IsNotEmpty()
  unitTitle: string;

  @IsString()
  @IsNotEmpty()
  exericseTitle: string;

  @Type(() => ExerciseDto)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  exercise: ExerciseDto[];
}

export class ExerciseDto {
  id: string;
  title?: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  qid: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @Type((opts) => {
    const af = new AnswersFactory();

    const casted = af.initialize().factorize(opts.object.type);

    if (casted instanceof Error) {
      throw new UnprocessableEntityException(
        `cannot process exercise for type ${opts.object.type}`,
      );
    }
    return casted.constructor;
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  answers: ExerciseTypes[];
}
