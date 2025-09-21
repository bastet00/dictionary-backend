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
    return this.findOneBy('title', title);
  }

  /**
   * Get all exercises ordered by title
   */
  async findAllByTitle(): Promise<Exercise[]> {
    return this.findAll('title', 'asc');
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
}
