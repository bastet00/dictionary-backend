import { Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { RavenModule } from '../raven/raven.module';
import { SentenceService } from './sentence.service';

@Module({
  imports: [RavenModule],
  controllers: [WordController],
  providers: [WordService, SentenceService],
  exports: [WordService],
})
export class WordModule {}
