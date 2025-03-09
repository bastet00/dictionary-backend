import { Injectable } from '@nestjs/common';
import { RavendbService } from 'src/raven/raven.service';
import {
  BulkCreateSentenceDto,
  CreateSentenceDto,
} from './dto/create-sentence.dto';

@Injectable()
export class AdminSentenceService {
  constructor(private readonly ravendbService: RavendbService) {}
  create(payload: CreateSentenceDto) {
    this.ravendbService.saveToDb(payload, 'sentence');
  }

  async createBulk(bulkPayload: BulkCreateSentenceDto) {
    await Promise.all(
      bulkPayload.sentences.map((payload) => {
        this.ravendbService.saveToDb(payload, 'sentence');
      }),
    );
  }
}
