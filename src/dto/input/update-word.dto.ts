import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { WordDto } from './create-word.dto';
import { Transform, Type } from 'class-transformer';
import { toUTF32String } from '../transformer/to-unicode';

class EgyptianWord {
  @IsString()
  @IsNotEmpty()
  Word: string;

  @IsNotEmpty()
  @MinLength(8)
  @Transform(({ value }) => value.trim())
  @Transform(toUTF32String)
  Symbol: string;
}

export class UpdateWordDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WordDto)
  Arabic: WordDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => EgyptianWord)
  Egyptian: EgyptianWord[];
}
