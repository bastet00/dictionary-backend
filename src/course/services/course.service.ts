import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseRepository } from '../db/repository/course.repository';
import { ExerciseRepository } from '../db/repository/exercise.repository';
import { Course, CourseUnit } from '../db/documents/course.document';
import { PatchUnitExerciseDto } from '../dto/patch-unit-exercise.dto';

@Injectable()
export class CourseService {
  constructor(
    private courseRepository: CourseRepository,
    private exerciseRepository: ExerciseRepository,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const existingCourse = await this.courseRepository.findByLevel(
      createCourseDto.level,
    );
    const newCourseData = this.toDocument(createCourseDto);

    if (!existingCourse) {
      // Create new course
      return this.courseRepository.create(newCourseData);
    }

    // Check if unit already exists
    const unitExists = existingCourse.units.some(
      (unit) => unit.num === createCourseDto.unit.num,
    );

    if (unitExists) {
      throw new BadRequestException('unit already exists');
    }

    // Add unit to existing course
    return this.courseRepository.addUnitToCourse(
      existingCourse.id!,
      newCourseData.units[0],
    );
  }

  async getCourse(level: string): Promise<Course> {
    const course = await this.courseRepository.findByLevel(parseInt(level));
    if (!course) {
      throw new BadRequestException('course level not found');
    }
    return course;
  }

  async patchUnitExercise(
    patchUnitExerciseDto: PatchUnitExerciseDto,
  ): Promise<Course> {
    const course = await this.courseRepository.findById(
      patchUnitExerciseDto.courseId,
    );
    if (!course) {
      throw new BadRequestException('course id does not exist');
    }

    const exercise = await this.exerciseRepository.findById(
      patchUnitExerciseDto.exerciseId,
    );
    if (!exercise) {
      throw new BadRequestException('exercise id does not exist');
    }

    const exerciseData = {
      id: exercise.id!,
      title: exercise.title,
    };

    const updatedCourse = await this.courseRepository.addExerciseToUnit(
      course.id!,
      patchUnitExerciseDto.unitNum,
      exerciseData,
    );

    if (!updatedCourse) {
      throw new BadRequestException(
        'unit number does not exist in this course',
      );
    }

    return updatedCourse;
  }

  private toDocument(createCourseDto: CreateCourseDto): Omit<Course, 'id'> {
    const course = {
      title: createCourseDto.title,
      level: createCourseDto.level,
      units: [],
    };
    const unit = {
      num: createCourseDto.unit.num,
      title: createCourseDto.unit.title,
      exercises: [],
    } as CourseUnit;

    course.units.push(unit);
    return course as Omit<Course, 'id'>;
  }
}
