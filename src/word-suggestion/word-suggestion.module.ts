import { Module } from '@nestjs/common';
import { WordSuggestionController } from './word-suggestion.controller';
import { WordSuggestionService } from './word-suggestion.service';
import { RavenModule } from '../raven/raven.module';

@Module({
  imports: [RavenModule],
  controllers: [WordSuggestionController],
  providers: [WordSuggestionService],
})
export class WordSuggestionModule {}
