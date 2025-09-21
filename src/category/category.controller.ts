import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CategoryService } from './category.service';

@Controller(['api/v1/category', 'category'])
@UseInterceptors(CacheInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategory() {
    return this.categoryService.getCategory();
  }

  @Get(':categoryId/words')
  @CacheTTL(24 * 60 * 60 * 1000) // 24 hours in milliseconds
  getCategoryWords(@Param('categoryId') categoryId: string) {
    return this.categoryService.findWordsByCategoryId(categoryId);
  }
}
