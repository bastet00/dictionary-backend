import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller(['api/v1/category', 'category'])
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategory() {
    return this.categoryService.getCategory();
  }

  @Get(':categoryId/words')
  getCategoryWords(@Param('categoryId') categoryId: string) {
    return this.categoryService.findWordsByCategoryId(categoryId);
  }
}
