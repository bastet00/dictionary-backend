import { Module } from '@nestjs/common';
import { LiteralTranslationService } from './literal-translation.service';
import { LiteralTranslationController } from './literal-translation.controller';

@Module({
  providers: [LiteralTranslationService],
  controllers: [LiteralTranslationController],
})
export class LiteralTranslationModule {}
