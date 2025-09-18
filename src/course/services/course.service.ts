import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { DataBaseRepository } from '../db/repository/course.repository';
import { Course, CourseUnit } from '../db/documents/course.document';
import { PatchUnitExerciseDto } from '../dto/patch-unit-exercise.dto';
import { Exercise } from '../db/documents/exercise.document';

@Injectable()
export class CourseService {
  constructor(private databaseRepo: DataBaseRepository) {}

  private toDocument(createCourseDto: CreateCourseDto) {
    this.databaseRepo;
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
    return course as Course;
  }

  async createCourse(createCourseDto: CreateCourseDto) {
    const repo = this.databaseRepo.withSession();
    const course = await repo.loadOneByOrFail<Course>({
      fieldName: 'level',
      value: createCourseDto.level,
      collection: 'course',
    });
    const newCourse = this.toDocument(createCourseDto);

    if (!course.founded) {
      console.log(newCourse.units[0].exercises);

      const doc = await repo.createDocument('course', newCourse);
      repo.save();
      return doc;
    }

    const unitExists = course.result.units.some(
      (unit) => unit.num === createCourseDto.unit.num,
    );

    if (unitExists) {
      throw new BadRequestException('unit already exists');
    }
    course.result.units.push(newCourse.units[0]);
    repo.save();
    delete course.result['@metadata'];
    return course.result;
  }

  async getCourse(level: string) {
    const repo = this.databaseRepo.withSession();
    const course = await repo.loadOneByOrFail<Course>({
      fieldName: 'level',
      value: level,
      collection: 'course',
    });
    if (!course.founded) {
      throw new BadRequestException('course level not founded');
    }
    delete course.result['@metadata'];
    return course.result;
  }

  async patchUnitExercise(patchUnitExerciseDto: PatchUnitExerciseDto) {
    const repo = this.databaseRepo.withSession();
    const course = await repo.loadById<Course>(patchUnitExerciseDto.courseId);
    if (!course.founded) {
      throw new BadRequestException('course id doesnt exist');
    }

    const exercise = await repo.loadById<Exercise>(
      patchUnitExerciseDto.exerciseId,
    );
    if (!exercise.founded) {
      throw new BadRequestException('exercise id doesnt exist');
    }
    const unitIdx = course.result.units.findIndex(
      (obj) => obj.num === patchUnitExerciseDto.unitNum,
    );
    if (unitIdx === -1) {
      throw new BadRequestException('unit number doesnt exist');
    }
    course.result.units[unitIdx].exercises.push({
      id: exercise.result.id,
      title: exercise.result.title,
    });
    repo.save();
    delete course.result['@metadata'];
    return course.result;
  }
}
