import { Injectable } from '@nestjs/common';
import { CategoryEnum } from './dto/category.enum';

@Injectable()
export class CategoryService {
  private categoryEnumAsArray() {
    return Object.keys(CategoryEnum);
  }

  getCategory() {
    return {
      category: this.categoryEnumAsArray(),
    };
  }
}
