import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateSentenceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(4000)
  arabic: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(4000)
  transliteration: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(4000)
  english: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(4000)
  egyptian: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  german: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  british: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  hieroglyphic: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  resource: string;
}

export class BulkCreateSentenceDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateSentenceDto)
  @ValidateNested({ each: true })
  sentences: CreateSentenceDto[];
}
