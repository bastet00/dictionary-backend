import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { RavendbService } from '../raven/raven.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
          max: 100, // maximum number of items in cache
        }),
      ],
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: RavendbService,
          useValue: {
            // Mock methods and properties of RavendbService as needed
          },
        },
        {
          provide: 'HttpService',
          useValue: {
            // Mock methods and properties of HttpService as needed
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
