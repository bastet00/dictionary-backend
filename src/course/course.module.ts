import { Module } from '@nestjs/common';
import { CourseService } from './services/course.service';
import { CourseController } from './controllers/course.controller';
import { RavenModule } from 'src/raven/raven.module';
import { DataBaseRepository } from './db/repository/course.repository';
import { ExerciseController } from './controllers/exercise.controller';
import { ExerciseService } from './services/exercise.service';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';

@Module({
  imports: [RavenModule],
  controllers: [CourseController, ExerciseController, QuestionController],
  providers: [
    CourseService,
    DataBaseRepository,
    ExerciseService,
    QuestionService,
  ],
})
export class CourseModule {}
