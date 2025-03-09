import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';
import { WordModule } from 'src/word/word.module';
import { SentenceService } from './sentence.service';

@Module({
  imports: [WordModule],
  controllers: [TranslationController],
  providers: [TranslationService, SentenceService],
})
export class TranslationModule {}
