import { Module } from '@nestjs/common';
import { RavendbService } from 'src/raven/raven.service';
import { WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
  controllers: [WordController],
  providers: [WordService, RavendbService],
})
export class WordModule {}
