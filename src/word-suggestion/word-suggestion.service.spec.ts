import { Test, TestingModule } from '@nestjs/testing';
import { WordSuggestionService } from './word-suggestion.service';

describe('WordSuggestionService', () => {
  let service: WordSuggestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordSuggestionService],
    }).compile();

    service = module.get<WordSuggestionService>(WordSuggestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
