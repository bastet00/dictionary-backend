import { Test, TestingModule } from '@nestjs/testing';
import { AdminWordService } from './admin.word.service';

describe('AdminWordService', () => {
  let service: AdminWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminWordService],
    }).compile();

    service = module.get<AdminWordService>(AdminWordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
