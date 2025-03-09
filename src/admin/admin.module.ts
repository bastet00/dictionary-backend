import { Module } from '@nestjs/common';
import { AdminWordController } from './word/admin-word.controller';
import { AdminWordService } from './word/admin-word.service';
import { RavenModule } from '../raven/raven.module';
import { AdminSentenceController } from './sentence/admin-sentence.controller';
import { AdminSentenceService } from './sentence/admin-sentence.service';

@Module({
  imports: [RavenModule],
  controllers: [AdminWordController, AdminSentenceController],
  providers: [AdminWordService, AdminSentenceService],
})
export class AdminModule {}
