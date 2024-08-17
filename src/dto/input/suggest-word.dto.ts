import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EgyptianWordDto } from './create-word.dto';
import { Type } from 'class-transformer';

class TranslationDto {
  @IsString()
  @IsNotEmpty()
  Word: string;
}

export class CreateSuggetionDto {
  @IsOptional()
  @IsEmail()
  Email: string;

  @IsNotEmpty()
  @IsString()
  Language: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => TranslationDto)
  @ValidateNested({ each: true })
  Translation: TranslationDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => EgyptianWordDto)
  @ValidateNested({ each: true })
  Egyptian: EgyptianWordDto[];
}
