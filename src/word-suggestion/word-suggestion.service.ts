import { Injectable } from '@nestjs/common';
import { RavendbService } from '../raven/raven.service';
import { CreateSuggestionDto } from './dto/word-suggestion.dto';

@Injectable()
export class WordSuggestionService {
  constructor(private readonly ravendbService: RavendbService) {}

  createWordSuggestion(payload: CreateSuggestionDto) {
    this.ravendbService.saveToDb(payload, 'word-suggestion');
  }
}
