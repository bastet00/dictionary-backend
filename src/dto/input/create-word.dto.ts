import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

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

  Unicode: string; // acceptable empty unicode for now

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 2)
  Symbol: string;
}
export class CreateWordDto {
  @IsNotEmpty()
  @IsArray()
  @Type(() => ArabicWordDto)
  // @ValidateNested({ each: true })
  Arabic: ArabicWordDto[];

  @IsNotEmpty()
  @IsArray()
  @Type(() => EgyptianWordDto)
  @ValidateNested({ each: true })
  Egyptian: EgyptianWordDto[];
}
