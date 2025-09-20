import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { RavendbService } from 'src/raven/raven.service';
import { Course } from '../documents/course.document';

@Injectable()
export class CourseRepository extends BaseRepository<Course> {
  constructor(ravenService: RavendbService) {
    super(ravenService);
  }

  protected getCollectionName(): string {
    return 'course';
  }

  /**
   * Find course by level
   */
  async findByLevel(level: number): Promise<Course | null> {
    return this.withReadSession(async (session) => {
      return this.findOneBy('level', level, session);
    });
  }

  /**
   * Find course by title
   */
  async findByTitle(title: string): Promise<Course | null> {
    return this.withReadSession(async (session) => {
      return this.findOneBy('title', title, session);
    });
  }

  /**
   * Get all courses ordered by level
   */
  async findAllByLevel(): Promise<Course[]> {
    return this.withReadSession(async (session) => {
      return this.findAll('level', 'asc', session);
    });
  }

  /**
   * Add unit to existing course
   */
  async addUnitToCourse(
    courseId: string,
    unit: {
      num: number;
      title: string;
      exercises: { id: string; title: string }[];
    },
  ): Promise<Course | null> {
    return this.withSession(async (session) => {
      const course = (await session.load(courseId)) as Course;
      if (!course) return null;

      // Add the unit to the existing course
      course.units.push(unit);

      return course;
    });
  }

  /**
   * Add exercise to unit in course
   */
  async addExerciseToUnit(
    courseId: string,
    unitNum: number,
    exercise: { id: string; title: string },
  ): Promise<Course | null> {
    return this.withSession(async (session) => {
      const course = (await session.load(courseId)) as Course;
      if (!course) return null;

      const unitIndex = course.units.findIndex((unit) => unit.num === unitNum);
      if (unitIndex === -1) return null;

      // Add exercise to the unit
      course.units[unitIndex].exercises.push(exercise);

      return course;
    });
  }
}
