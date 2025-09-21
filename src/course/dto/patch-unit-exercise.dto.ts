import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class PatchUnitExerciseDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  exerciseId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @IsInt()
  @Min(1)
  unitNum: number;
}
