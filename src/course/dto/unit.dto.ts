import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Exercise } from '../db/documents/exercise.document';

export class UnitDto {
  @IsInt()
  @Min(1)
  num: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  exercises: Exercise[];
}
