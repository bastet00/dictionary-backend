import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class UserAnswerDto {
  @IsInt()
  @Min(1)
  aid: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  order?: number[];
}
