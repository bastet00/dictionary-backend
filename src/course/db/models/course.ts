export interface CourseExercise {
  title: string;
  id: string;
}

export interface CourseUnit {
  num: number;
  title: string;
  exercises: CourseExercise[];
}

export interface Course {
  id: string;
  title: string;
  level: number;
  units: CourseUnit[];
}
