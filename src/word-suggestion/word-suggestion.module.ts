import { Module } from '@nestjs/common';
import { WordSuggestionController } from './word-suggestion.controller';
import { WordSuggestionService } from './word-suggestion.service';
import { RavendbService } from 'src/raven/raven.service';

@Module({
  controllers: [WordSuggestionController],
  providers: [WordSuggestionService, RavendbService],
})
export class WordSuggestionModule {}
