import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { RavenModule } from 'src/raven/raven.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      max: 100, // maximum number of items in cache
    }),
    RavenModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
