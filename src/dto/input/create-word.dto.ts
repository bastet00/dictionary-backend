import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class ArabicWordDto {
  @IsNotEmpty()
  @IsString()
  Word: string;
}

class EgyptianWordDto {
  @IsNotEmpty()
  @IsString()
  Word: string;

  @IsNotEmpty()
  @IsString()
  Unicode: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(2, 2)
  Symbol: string;
}
export class CreateWordDto {
  @IsNotEmpty()
  @IsArray()
  @Type(() => ArabicWordDto)
  @ValidateNested({ each: true })
  Arabic: ArabicWordDto[];

  @IsNotEmpty()
  @IsArray()
  @Type(() => EgyptianWordDto)
  @ValidateNested({ each: true })
  Egyptian: ArabicWordDto[];
}
