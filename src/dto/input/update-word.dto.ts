import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { toUTF32String } from '../transformer/to-unicode';
import { WordDto } from './create-word.dto';

class EgyptianWord {
  @IsString()
  @IsNotEmpty()
  Word: string;

  @IsNotEmpty()
  @Length(8)
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
