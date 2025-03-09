import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { EgyptianWordDto } from 'src/dto/input/word/create-word.dto';
import { Transform, Type } from 'class-transformer';
import { toUTF32String } from 'src/dto/transformer';

class TranslationDto {
  @IsString()
  @IsNotEmpty()
  word: string;
}

export class EgyptianWordSuggestionDto extends EgyptianWordDto {
  @IsOptional()
  @Length(8)
  @Transform(({ value }) => value.trim())
  @Transform(toUTF32String)
  symbol: string;
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

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => EgyptianWordSuggestionDto)
  @ValidateNested({ each: true })
  egyptian: EgyptianWordSuggestionDto[];
}
