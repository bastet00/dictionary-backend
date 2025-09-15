export interface UnitExercise {
  title: string;
  id: string;
}

export interface CourseUnit {
  num: number;
  title: string;
  exercises: UnitExercise[];
}

export interface Course {
  id: string;
  title: string;
  level: number;
  units: CourseUnit[];
}
