import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { RavendbService } from '../raven/raven.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
