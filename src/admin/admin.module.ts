import { Module } from '@nestjs/common';
import { RavendbService } from 'src/raven/raven.service';
import { AdminWordController } from './word/admin-word.controller';
import { AdminWordService } from './word/admin-word.service';

@Module({
  controllers: [AdminWordController],
  providers: [AdminWordService, RavendbService],
})
export class AdminModule {}
