import { Test, TestingModule } from '@nestjs/testing';
import { WordSuggestionController } from './word-suggestion.controller';

describe('WordSuggestionController', () => {
  let controller: WordSuggestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordSuggestionController],
    }).compile();

    controller = module.get<WordSuggestionController>(WordSuggestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
