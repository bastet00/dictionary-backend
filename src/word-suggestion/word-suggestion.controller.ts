import { Body, Controller, Post } from '@nestjs/common';
import { WordSuggestionService } from './word-suggestion.service';
import { CreateSuggestionDto } from './dto/word-suggestion.dto';

@Controller('word-suggestion')
export class WordSuggestionController {
  constructor(private readonly wordSuggestionService: WordSuggestionService) {}

  @Post()
  createWordSuggestion(@Body() createSuggestionDto: CreateSuggestionDto) {
    return this.wordSuggestionService.createWordSuggestion(createSuggestionDto);
  }
}
