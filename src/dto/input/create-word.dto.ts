import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { toUTF32String } from '../transformer/to-unicode';

export class WordDto {
  @IsNotEmpty()
  @IsString()
  Word: string;
}

export class EgyptianWordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  Word: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  Transliteration: string;

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(40)
  @IsString({ each: true })
  Hieroglyphics: string[];

  @IsNotEmpty()
  @Length(8)
  @Transform(({ value }) => value.trim())
  @Transform(toUTF32String)
  Symbol: string;
}
export class CreateWordDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => WordDto)
  @ValidateNested({ each: true })
  Arabic: WordDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => WordDto)
  @ValidateNested({ each: true })
  English: WordDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => EgyptianWordDto)
  @ValidateNested({ each: true })
  Egyptian: EgyptianWordDto[];
}

export class BulkCreateWordDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateWordDto)
  @ValidateNested({ each: true })
  words: CreateWordDto[];
}
