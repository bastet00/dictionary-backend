import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { RavenModule } from 'src/raven/raven.module';

@Module({
  imports: [RavenModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
