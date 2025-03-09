import { Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { RavenModule } from '../raven/raven.module';

@Module({
  imports: [RavenModule],
  controllers: [WordController],
  exports: [WordService],
  providers: [WordService],
})
export class WordModule {}
