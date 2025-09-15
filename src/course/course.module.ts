import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './controllers/course.controller';
import { RavenModule } from 'src/raven/raven.module';
import { DataBaseRepository } from './db/repository/course.repository';

@Module({
  imports: [RavenModule],
  controllers: [CourseController],
  providers: [CourseService, DataBaseRepository],
})
export class CourseModule {}
