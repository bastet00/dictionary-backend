import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategory() {
    return this.categoryService.getCategory();
  }

  // NOTE: Testing category dto
  @Post()
  addCategory(@Body() category: CategoryDto) {
    console.log(category);
    return 'Hello';
  }
}
