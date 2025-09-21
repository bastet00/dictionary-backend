import { BadRequestException, Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../db/repository/exercise.repository';
import { QuestionRepository } from '../db/repository/question.repository';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { Exercise } from '../db/documents/exercise.document';
import { Question } from '../db/documents/question.document';

@Injectable()
export class ExerciseService {
  constructor(
    private exerciseRepository: ExerciseRepository,
    private questionRepository: QuestionRepository,
  ) {}

  async loadExerciseByTitle(title: string): Promise<Exercise | null> {
    return this.exerciseRepository.findByTitle(title);
  }

  async createExercise(
    createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    const existingExercise = await this.loadExerciseByTitle(
      createExerciseDto.title,
    );
    if (existingExercise) {
      throw new BadRequestException('exercise already exists');
    }

    const exerciseData: Omit<Exercise, 'id'> = {
      title: createExerciseDto.title,
      questions: [],
    };
    return this.exerciseRepository.createAndSave(exerciseData);
  }

  async pushQuestionToExercise(
    exerciseId: string,
    qid: string,
  ): Promise<Exercise> {
    const question = await this.questionRepository.findById(qid);
    if (!question) {
      throw new BadRequestException('question not found');
    }

    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (!exercise) {
      throw new BadRequestException('exercise not found');
    }

    return this.exerciseRepository.addQuestionToExercise(exerciseId, qid);
  }

  async getExerciseById(id: string): Promise<{
    id: string;
    title: string;
    questions: Question[];
  }> {
    const exercise = await this.exerciseRepository.findById(id);
    if (!exercise) {
      throw new BadRequestException('exercise not found');
    }

    // Load all questions for this exercise in a single batch
    const questionIds = exercise.questions.map((q) => q.id);
    const questions: Question[] =
      await this.questionRepository.findByIds(questionIds);

    return {
      id: exercise.id!,
      title: exercise.title,
      questions: questions,
    };
  }
}
