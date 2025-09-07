import { ExerciseDto } from './create-course.dto';

export interface Course {
  course: {
    title: string;
    level: number;
    units: Unit[];
  };
  exercises: ExerciseDto[];
}

export interface CourseDocument {
  title: string;
  level: number;
  units: Unit[];
  id: string;
}

export interface Unit {
  num: number;
  title: string;
  exerciseIds: string[];
  exercises?: ExerciseDto[];
}
