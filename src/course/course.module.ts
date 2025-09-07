import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { RavenModule } from 'src/raven/raven.module';

@Module({
  imports: [RavenModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
