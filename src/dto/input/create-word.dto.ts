import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { toUTF32String } from '../transformer/to-unicode';

class ArabicWordDto {
  /*  WARNING:
   * sending post request overwrites the key make the server only recives the last pair
   *
   * NOTE:
   * dealing with Arabic as string[] until figure out final scheme
   */
  @IsNotEmpty()
  @IsString()
  Word: string;
}

class EgyptianWordDto {
  @IsNotEmpty()
  @IsString()
  Word: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(8)
  @Transform(({ value }) => value.trim())
  @Transform(toUTF32String)
  Symbol: string;
}
export class CreateWordDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ArabicWordDto)
  @ValidateNested({ each: true })
  Arabic: ArabicWordDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => EgyptianWordDto)
  @ValidateNested({ each: true })
  Egyptian: EgyptianWordDto[];
}
