import { Injectable } from '@nestjs/common';
import { RavendbService } from 'src/raven/raven.service';
import { IDocumentSession, IDocumentQuery } from 'ravendb';

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
  async findById(id: string, session?: IDocumentSession): Promise<T | null> {
    const sessionToUse = session || this.ravenService.session();
    try {
      const result = await sessionToUse.load(id);
      return (result as T) || null;
    } catch {
      return null;
    }
  }

  /**
   * Find one by field
   */
  async findOneBy(
    field: keyof T,
    value: any,
    session?: IDocumentSession,
  ): Promise<T | null> {
    const sessionToUse = session || this.ravenService.session();
    try {
      const result = await this.query(sessionToUse)
        .whereEquals(field as string, value)
        .single();
      return (result as T) || null;
    } catch {
      return null;
    }
  }

  /**
   * Find all with optional ordering
   */
  async findAll(
    orderBy?: keyof T,
    order: 'asc' | 'desc' = 'desc',
    session?: IDocumentSession,
  ): Promise<T[]> {
    const sessionToUse = session || this.ravenService.session();
    let query = this.query(sessionToUse);

    if (orderBy) {
      query =
        order === 'desc'
          ? query.orderByDescending(orderBy as string)
          : query.orderBy(orderBy as string);
    }

    return (await query.all()) as T[];
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
    const id = crypto.randomUUID();

    // Create the entity with ID
    const entityWithId = { ...entity, id } as T;

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
    } catch {
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
