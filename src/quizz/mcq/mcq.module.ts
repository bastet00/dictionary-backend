import { Module } from '@nestjs/common';
import { McqService } from './mcq.service';
import { McqController } from './mcq.controller';

@Module({
  controllers: [McqController],
  providers: [McqService],
})
export class McqModule {}
