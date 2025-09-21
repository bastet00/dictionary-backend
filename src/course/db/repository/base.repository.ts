import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RavendbService } from 'src/raven/raven.service';
import { IDocumentSession, IDocumentQuery } from 'ravendb';
import { randomUUID } from 'crypto';

export interface BaseEntity {
  id?: string;
  '@metadata'?: any;
}

@Injectable()
export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly ravenService: RavendbService) {}

  /**
   * Execute operations within a session context with auto-save
   */
  async withSession<R>(
    operation: (session: IDocumentSession) => Promise<R>,
  ): Promise<R> {
    const session = this.ravenService.session();
    try {
      const result = await operation(session);
      await session.saveChanges();
      return result;
    } finally {
      session.dispose();
    }
  }

  /**
   * Execute operations without auto-save (for read operations)
   */
  async withReadSession<R>(
    operation: (session: IDocumentSession) => Promise<R>,
  ): Promise<R> {
    const session = this.ravenService.session();
    try {
      return await operation(session);
    } finally {
      session.dispose();
    }
  }

  /**
   * Find by ID
   */
  async findById(id: string): Promise<T | null> {
    return this.withReadSession(async (session) => {
      try {
        const result = await session.load(id);
        return (result as T) || null;
      } catch (error) {
        console.error(
          `Failed to load entity with id ${id}: for document type ${this.getCollectionName()}`,
          error,
        );
        return null;
      }
    });
  }

  /**
   * Find by ID (throws exception if not found)
   */
  async findByIdOrFail(id: string): Promise<T> {
    return this.withReadSession(async (session) => {
      try {
        const result = await session.load(id);
        if (!result) {
          throw new NotFoundException(`Entity with id ${id} not found`);
        }
        return result as T;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        console.error(`Database error loading entity with id ${id}:`, error);
        throw new InternalServerErrorException('Failed to load entity');
      }
    });
  }

  /**
   * Find one by field
   */
  async findOneBy(field: keyof T, value: any): Promise<T | null> {
    return this.withReadSession(async (session) => {
      try {
        const result = await this.query(session)
          .whereEquals(field as string, value)
          .single();
        return (result as T) || null;
      } catch (error) {
        console.error(
          `Failed to load entity with field ${field as string}, value ${value}: for document type ${this.getCollectionName()}`,
          error,
        );
        return null;
      }
    });
  }

  /**
   * Find all with optional ordering
   */
  async findAll(
    orderBy?: keyof T,
    order: 'asc' | 'desc' = 'desc',
  ): Promise<T[]> {
    return this.withReadSession(async (session) => {
      let query = this.query(session);

      if (orderBy) {
        query =
          order === 'desc'
            ? query.orderByDescending(orderBy as string)
            : query.orderBy(orderBy as string);
      }

      return (await query.all()) as T[];
    });
  }

  /**
   * Create a new document
   * Following RavenDB best practices:
   * - Use session.Store() to add entity to session's internal map
   * - Let session track changes automatically
   * - Don't call saveChanges() automatically (let caller decide when to save)
   */
  async create(entity: Omit<T, 'id'>, session: IDocumentSession): Promise<T> {
    const sessionToUse = session;
    const id = randomUUID();

    // Create the entity with ID and metadata
    const entityWithId = {
      ...entity,
      id,
      '@metadata': { '@collection': this.getCollectionName() },
    } as T;

    // Store in session - this adds to session's internal map and enables change tracking
    sessionToUse.store(entityWithId, id, {
      documentType: this.getCollectionName(),
    });

    return entityWithId;
  }

  /**
   * Create and save a new document (convenience method)
   * For simple cases where you don't need transaction control
   */
  async createAndSave(entity: Omit<T, 'id'>): Promise<T> {
    return this.withSession(async (session) => {
      return this.create(entity, session);
    });
  }

  /**
   * Delete an entity
   */
  async delete(id: string, session: IDocumentSession): Promise<boolean> {
    const sessionToUse = session;
    try {
      sessionToUse.delete(id);
      return true;
    } catch (error) {
      console.error(`Failed to delete entity with id ${id}:`, error);
      return false;
    }
  }

  /**
   * Get base query for the collection
   */
  protected query(session: IDocumentSession): IDocumentQuery<object> {
    return session.query({ collection: this.getCollectionName() });
  }

  /**
   * Abstract method to define collection name
   */
  protected abstract getCollectionName(): string;
}
