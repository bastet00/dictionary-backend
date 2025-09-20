import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { RavendbService } from 'src/raven/raven.service';
import { Exercise } from '../documents/exercise.document';

@Injectable()
export class ExerciseRepository extends BaseRepository<Exercise> {
  constructor(ravenService: RavendbService) {
    super(ravenService);
  }

  protected getCollectionName(): string {
    return 'exercise';
  }

  /**
   * Find exercise by title
   */
  async findByTitle(title: string): Promise<Exercise | null> {
    return this.withReadSession(async (session) => {
      return this.findOneBy('title', title, session);
    });
  }

  /**
   * Get all exercises ordered by title
   */
  async findAllByTitle(): Promise<Exercise[]> {
    return this.withReadSession(async (session) => {
      return this.findAll('title', 'asc', session);
    });
  }

  /**
   * Add question to exercise
   */
  async addQuestionToExercise(
    exerciseId: string,
    questionId: string,
  ): Promise<Exercise | null> {
    return this.withSession(async (session) => {
      const exercise = (await session.load(exerciseId)) as Exercise;
      if (!exercise) return null;

      // Add question to the exercise
      exercise.questions.push({ id: questionId });

      return exercise;
    });
  }

  /**
   * Get exercise with populated questions
   */
  async getExerciseWithQuestions(exerciseId: string): Promise<{
    id: string;
    title: string;
    questions: any[];
  } | null> {
    return this.withReadSession(async (session) => {
      const exercise = await this.findById(exerciseId, session);
      if (!exercise) return null;

      // Load all questions for this exercise
      const questions = [];
      for (const questionRef of exercise.questions) {
        const question = await session.load(questionRef.id);
        if (question) {
          questions.push(question);
        }
      }

      return {
        id: exercise.id!,
        title: exercise.title,
        questions: questions,
      };
    });
  }
}
