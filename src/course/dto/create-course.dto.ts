import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { UnitDto } from './unit.dto';

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
