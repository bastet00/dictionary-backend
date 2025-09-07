import { Injectable, NotFoundException } from '@nestjs/common';
import { RavendbService } from 'src/raven/raven.service';
import { CreateCourseDto, ExerciseDto } from './dto/create-course.dto';
import { Course, CourseDocument, Unit } from './dto/Course';
import { StorageOpts } from './types/storage-options';
import { IDocumentSession } from 'ravendb';
import { UserAnswerDto } from './dto/user-answers.dto';
import { AnswersFactory } from './factory/factory';

@Injectable()
export class CourseService {
  constructor(private ravenService: RavendbService) {}

  async createCourse(createCourseDto: CreateCourseDto) {
    const payloadToEntity = this.toEntities(createCourseDto);
    const session = this.ravenService.session();
    const buildCourseFn = this.courseBuild(session, payloadToEntity.course);
    const buildExerciseFn = this.exerciseBuild(
      session,
      payloadToEntity.exercises,
    );
    try {
      const courseDoc = await session
        .query<CourseDocument>({ collection: 'course' })
        .whereEquals('level', createCourseDto.courseLevel)
        .single();

      const [newUnit] = payloadToEntity.course.units;
      if (courseDoc) {
        const unit = courseDoc.units.find(
          (obj) => obj.num === createCourseDto.unitNum,
        );
        if (unit) {
          unit.exerciseIds.push(...newUnit.exerciseIds);
          await buildExerciseFn();
        } else {
          courseDoc.units.push(newUnit);
          await buildExerciseFn();
        }
      }
    } catch {
      await buildCourseFn();
      await buildExerciseFn();
    }
    // console.log(session.advanced.numberOfRequests);
    await session.saveChanges();
  }

  toEntities(createCourseDto: CreateCourseDto): Course {
    const course = {
      title: createCourseDto.courseTitle,
      level: createCourseDto.courseLevel,
      units: [],
    };
    const unit = {
      num: createCourseDto.unitNum,
      title: createCourseDto.unitTitle,
      exerciseIds: [],
    } as Unit;

    // TODO: consider think about this after correctness implementation
    let qid = 1;
    let aid = 1;
    createCourseDto.exercise.map((obj: ExerciseDto) => {
      const id = crypto.randomUUID();
      obj.id = id;
      unit.exerciseIds.push(obj.id);
      obj.qid = qid;
      obj.answers.map((obj) => {
        obj.aid = aid;
        aid++;
      });
      qid++;
    });

    course.units.push(unit);
    return {
      course,
      exercises: createCourseDto.exercise,
    };
  }

  /**
   * @returns: ready to call function which stores Course document
   * */
  courseBuild(session: IDocumentSession, data: Course[keyof Course]) {
    const opts = {
      collection: 'course',
      seperation: false,
      document: data,
      session: session,
    };
    return async () => await this.storage(opts);
  }

  /**
   * @return: ready to call function which stores Exercise\s document
   * */
  exerciseBuild(session: IDocumentSession, data: Course[keyof Course]) {
    const opts = {
      collection: 'question',
      seperation: true,
      document: data,
      session: session,
    };

    return async () => await this.storage(opts);
  }

  async storage(opts: StorageOpts) {
    const session = opts.session;
    const setup = (obj: any) => {
      return { ...obj, '@metadata': { '@collection': opts.collection } };
    };

    if (opts.seperation) {
      for (const exercise of opts.document as ExerciseDto[]) {
        await session.store(setup(exercise), exercise.id);
      }
    } else {
      await session.store(setup(opts.document), `${opts.collection}|`);
    }
  }

  async getCourseByLevel(level: string) {
    try {
      const session = this.ravenService.session();
      const course = await session
        .query<CourseDocument>({ collection: 'course' })
        .include('question')
        .whereEquals('level', level)
        .single();

      for (const unit of course.units) {
        for (const exerciseId of unit.exerciseIds) {
          const exById = await session.load<ExerciseDto>(exerciseId);
          delete exById['@metadata'];
          if (!unit.exercises) {
            unit.exercises = [];
          }

          unit.exercises.push(exById); // TODO: hide answers;
        }
        delete unit.exerciseIds;
      }

      return { ...course, '@metadata': undefined };
    } catch {
      throw new NotFoundException('course level doesnt exist');
    }
  }

  async checkUserAnswers(eId: string, userAnswerDto: UserAnswerDto) {
    const session = this.ravenService.session();
    const exercise = await session.load<ExerciseDto>(eId);
    if (exercise) {
      const result = new AnswersFactory()
        .initialize()
        .check(exercise, userAnswerDto);
      return result;
    }
    throw new NotFoundException('exercise id doesnt exist');
  }
}
