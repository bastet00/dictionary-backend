import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { RavendbService } from 'src/raven/raven.service';
import { Question } from '../documents/question.document';

@Injectable()
export class QuestionRepository extends BaseRepository<Question> {
  constructor(ravenService: RavendbService) {
    super(ravenService);
  }

  protected getCollectionName(): string {
    return 'question';
  }

  /**
   * Find questions by type
   */
  async findByType(type: string): Promise<Question[]> {
    return this.withReadSession(async (session) => {
      return this.query(session)
        .whereEquals('type', type)
        .orderByDescending('created')
        .all() as Promise<Question[]>;
    });
  }

  /**
   * Find questions by tags
   */
  async findByIds(ids: string[]): Promise<Question[]> {
    return this.withReadSession(async (session) => {
      return this.query(session).whereIn('id', ids).all() as Promise<
        Question[]
      >;
    });
  }

  /**
   * Find questions by tags
   */
  async findByTags(tags: string[]): Promise<Question[]> {
    return this.withReadSession(async (session) => {
      return this.query(session)
        .whereIn('tags', tags)
        .orderByDescending('created')
        .all() as Promise<Question[]>;
    });
  }

  /**
   * Get all questions ordered by creation date
   */
  async findAllByCreated(): Promise<Question[]> {
    return this.findAll('created', 'desc');
  }

  /**
   * Create question with automatic timestamps
   */
  async createQuestion(
    questionData: Omit<Question, 'id' | 'created' | 'updated'>,
  ): Promise<Question> {
    const now = new Date();
    const fullQuestionData: Omit<Question, 'id'> = {
      ...questionData,
      created: now,
      updated: now,
      tags: questionData.tags || [],
    };

    return this.withSession(async (session) => {
      return this.create(fullQuestionData, session);
    });
  }
}
