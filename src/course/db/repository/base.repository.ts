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
   * Create a new document
   */
  async create(entity: Omit<T, 'id'>, session?: IDocumentSession): Promise<T> {
    const sessionToUse = session || this.ravenService.session();
    const id = crypto.randomUUID();
    const document = {
      ...entity,
      '@metadata': { '@collection': this.getCollectionName() },
    };

    await sessionToUse.store(document, id);
    return { ...entity, id } as T;
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
   * Update an entity
   */
  async update(
    id: string,
    updates: Partial<T>,
    session?: IDocumentSession,
  ): Promise<T | null> {
    const sessionToUse = session || this.ravenService.session();

    // Load the entity to ensure it exists and is tracked by the session
    const existing = (await sessionToUse.load(id)) as T;
    if (!existing) return null;

    // Apply updates to the loaded entity
    Object.assign(existing, updates);

    // The entity is already tracked, so we don't need to call store again
    return existing;
  }

  /**
   * Delete an entity
   */
  async delete(id: string, session?: IDocumentSession): Promise<boolean> {
    const sessionToUse = session || this.ravenService.session();
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
