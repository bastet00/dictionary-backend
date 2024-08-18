import { Injectable } from '@nestjs/common';
import { RavendbService } from 'src/raven/raven.service';
import { CreateSuggetionDto } from './dto/word-suggestion.dto';

@Injectable()
export class WordSuggestionService {
  constructor(private readonly ravendbService: RavendbService) {}

  createWordSuggestion(payload: CreateSuggetionDto) {
    this.ravendbService.saveToDb(payload, 'word-suggestion');
  }
}
