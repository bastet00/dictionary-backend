import { Module } from '@nestjs/common';
import { AdminWordController } from './word/admin-word.controller';
import { AdminWordService } from './word/admin-word.service';
import { RavenModule } from '../raven/raven.module';

@Module({
  imports: [RavenModule],
  controllers: [AdminWordController],
  providers: [AdminWordService],
})
export class AdminModule {}
