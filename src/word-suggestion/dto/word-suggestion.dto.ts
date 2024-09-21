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
  Word: string;
}

export class CreateSuggestionDto {
  @IsOptional()
  @IsEmail()
  Email: string;

  @IsOptional()
  @IsArray()
  @Type(() => TranslationDto)
  @ValidateNested({ each: true })
  Arabic: TranslationDto[];

  @IsOptional()
  @IsArray()
  @Type(() => TranslationDto)
  @ValidateNested({ each: true })
  English: TranslationDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => EgyptianWordDto)
  @ValidateNested({ each: true })
  Egyptian: EgyptianWordDto[];
}
