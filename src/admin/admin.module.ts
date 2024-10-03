import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RavendbService } from 'src/raven/raven.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, RavendbService],
})
export class AdminModule {}
