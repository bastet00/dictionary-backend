import { Test, TestingModule } from '@nestjs/testing';
import { LiteralTranslationService } from './literal-translation.service';
import { LiteralTranslationController } from './literal-translation.controller';
import { BadRequestException } from '@nestjs/common';
import { RequiredQueryPipe } from './dto/text-query.dto';

describe('LiteralTranslationController', () => {
  let controller: LiteralTranslationController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiteralTranslationController],
      providers: [LiteralTranslationService],
    }).compile();

    controller = module.get<LiteralTranslationController>(
      LiteralTranslationService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle empty strings', () => {
    const pipe = new RequiredQueryPipe();
    expect(() => pipe.transform('')).toThrow(BadRequestException);
  });
});
