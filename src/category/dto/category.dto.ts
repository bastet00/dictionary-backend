import { IsArray, IsEnum } from 'class-validator';
import { CategoryEnum } from './category.enum';

export class Category {
  @IsArray()
  @IsEnum(CategoryEnum, { each: true })
  category: string[];
}
