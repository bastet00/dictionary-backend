import { Test, TestingModule } from '@nestjs/testing';
import { AdminWordController } from './admin-word.controller';
import { AdminWordService } from './admin-word.service';

describe('AdminWordController', () => {
  let controller: AdminWordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminWordController],
      providers: [AdminWordService],
    }).compile();

    controller = module.get<AdminWordController>(AdminWordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
