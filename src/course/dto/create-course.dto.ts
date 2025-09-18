import { Type } from 'class-transformer';

import { Exercise } from '../db/documents/exercise.document';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class UnitDto {
  @IsInt()
  @Min(1)
  num: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  exercises: Exercise[];
}

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsInt()
  @Min(1)
  level: number;

  @Type(() => UnitDto)
  @ValidateNested()
  unit: UnitDto;
}
