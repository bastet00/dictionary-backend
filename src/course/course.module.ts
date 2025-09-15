import { Module } from '@nestjs/common';
import { CourseService } from './services/course.service';
import { CourseController } from './controllers/course.controller';
import { RavenModule } from 'src/raven/raven.module';
import { DataBaseRepository } from './db/repository/course.repository';
import { ExerciseController } from './controllers/exercise.controller';
import { ExerciseService } from './services/exercise.service';

@Module({
  imports: [RavenModule],
  controllers: [CourseController, ExerciseController],
  providers: [CourseService, DataBaseRepository, ExerciseService],
})
export class CourseModule {}
