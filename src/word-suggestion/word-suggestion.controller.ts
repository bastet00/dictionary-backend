import { Body, Controller, Post } from '@nestjs/common';
import { WordSuggestionService } from './word-suggestion.service';
import { CreateSuggetionDto } from './dto/word-suggestion.dto';

@Controller('word-suggestion')
export class WordSuggestionController {
  constructor(private readonly wordSuggestionService: WordSuggestionService) {}

  @Post('')
  createWordSuggetion(@Body() createSuggetionDto: CreateSuggetionDto) {
    return this.wordSuggestionService.createWordSuggestion(createSuggetionDto);
  }
}
