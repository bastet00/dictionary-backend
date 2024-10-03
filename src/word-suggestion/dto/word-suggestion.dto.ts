import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EgyptianWordDto } from 'src/dto/input/create-word.dto';
import { Type } from 'class-transformer';

class TranslationDto {
  @IsString()
  @IsNotEmpty()
  word: string;
}

export class CreateSuggestionDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsArray()
  @Type(() => TranslationDto)
  @ValidateNested({ each: true })
  arabic: TranslationDto[];

  @IsOptional()
  @IsArray()
  @Type(() => TranslationDto)
  @ValidateNested({ each: true })
  english: TranslationDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => EgyptianWordDto)
  @ValidateNested({ each: true })
  egyptian: EgyptianWordDto[];
}
