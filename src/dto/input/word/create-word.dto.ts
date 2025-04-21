import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { toUTF32String } from '../../transformer/to-unicode';
import { CategoryEnum } from 'src/category/dto/category.enum';

export class WordDto {
  @IsNotEmpty()
  @IsString()
  word: string;
}

export class EgyptianWordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  word: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  transliteration: string;

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(40)
  @IsString({ each: true })
  hieroglyphics: string[];

  @IsNotEmpty()
  @Length(8)
  @Transform(({ value }) => value.trim())
  @Transform(toUTF32String)
  symbol: string;
}
export class CreateWordDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => WordDto)
  @ValidateNested({ each: true })
  arabic: WordDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => WordDto)
  @ValidateNested({ each: true })
  english: WordDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => WordDto)
  @ValidateNested({ each: true })
  french: WordDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  resources: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => EgyptianWordDto)
  @ValidateNested({ each: true })
  egyptian: EgyptianWordDto[];

  @IsArray()
  @IsEnum(CategoryEnum, { each: true })
  category: string[] = [];
}

export class BulkCreateWordDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateWordDto)
  @ValidateNested({ each: true })
  words: CreateWordDto[];
}
