import { Module } from '@nestjs/common';
import { RavendbService } from './raven.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [RavendbService],
  exports: [RavendbService],
})
export class RavenModule {}
