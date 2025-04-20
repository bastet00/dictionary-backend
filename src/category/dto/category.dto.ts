import { IsArray, IsEnum } from 'class-validator';
import { CategoryEnum } from './category.enum';

export class CategoryDto {
  @IsArray()
  @IsEnum(CategoryEnum, { each: true })
  category: string[] = [];
}
