import { IDocumentQuery } from 'ravendb';

export type RepositoryCollections = 'course' | 'exercise' | 'question';

export interface IWhere {
  fieldName: string;
  value: any;
  collection: RepositoryCollections;
  allowWildcards?: boolean;
  nestedPath?: boolean;
  exact?: any;
}

export interface StorageOpts {
  document: any;
  collection: RepositoryCollections;
}

export type Maybe<T> = Promise<{
  result: Awaited<T>;
  founded: boolean;
}>;

export interface Repository {
  loadOneByOrFail<T>(opts: IWhere): Maybe<T>;

  queryOn(collection: RepositoryCollections): IDocumentQuery<object>;

  createDocument<T>(
    collection: RepositoryCollections,
    document: any,
  ): Promise<{ document: T; id: string }>;

  save(): Promise<void>;

  loadById<T>(id: string): Maybe<T>;

  loadAllOrderKey<T>(collection: RepositoryCollections, key: string): Maybe<T>;

  loadByIdAndRelations<T>(
    id: string,
    include: RepositoryCollections[],
  ): Maybe<T>;
}
