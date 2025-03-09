import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';
import { WordModule } from 'src/word/word.module';

@Module({
  imports: [WordModule],
  controllers: [TranslationController],
  providers: [TranslationService],
})
export class TranslationModule {}
