import { BadRequestException, Injectable } from '@nestjs/common';
import { DataBaseRepository } from '../db/repository/course.repository';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { Exercise } from '../db/documents/exercise.document';
import { Question } from '../db/documents/question.document';

@Injectable()
export class ExerciseService {
  constructor(private databaseRepo: DataBaseRepository) {}

  loadExerciseByTitle(title: string) {
    return this.databaseRepo.withSession().loadOneByOrFail<Exercise>({
      fieldName: 'title',
      value: title,
      collection: 'exercise',
    });
  }

  async createExercise(createExerciseDto: CreateExerciseDto) {
    const repo = this.databaseRepo.withSession();
    const exericse = await this.loadExerciseByTitle(createExerciseDto.title);
    if (exericse.founded) {
      throw new BadRequestException('exericse exists');
    }

    createExerciseDto.questions = [];
    const newExercise = repo.createDocument('exercise', createExerciseDto);
    repo.save();
    return newExercise;
  }

  async pushQuestionToExercise(eTitle: string, qid: string) {
    const repo = this.databaseRepo.withSession();
    const question = await repo.loadById<Question>(qid);
    if (!question.founded) {
      throw new BadRequestException('question not founded');
    }

    const exercise = await this.loadExerciseByTitle(eTitle);
    if (!exercise.founded) {
      throw new BadRequestException('exercise not founded');
    }
    exercise.result.questions.push({ id: question.result.id });
    delete exercise.result['@metadata'];
    repo.save();
    return exercise.result;
  }

  async getExerciseById(id: string) {
    const repo = this.databaseRepo.withSession();
    const exercise = await repo.loadByIdAndRelations<Exercise>(id, [
      'question',
    ]);
    if (!exercise.founded) {
      throw new BadRequestException('id doesnt exist');
    }
    const questions = [] as Question[];
    for (const question of exercise.result.questions) {
      const questionDoc = await repo.loadById<Question>(question.id);
      delete questionDoc.result['@metadata'];
      questions.push(questionDoc.result);
    }
    return {
      id: exercise.result.id,
      title: exercise.result.title,
      questions: questions,
    };
  }
}
