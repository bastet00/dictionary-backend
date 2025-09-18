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

type LoadOneByOrFail<T> = (opts: IWhere) => Maybe<T>;

type QueryOn = (collection: RepositoryCollections) => IDocumentQuery<object>;
type LoadById<T> = (id: string) => Maybe<T>;

type CreateDocument = (
  collection: RepositoryCollections,
  document: any,
) => Promise<{
  document: any;
  id: string;
}>;

type Save = () => Promise<void>;
type LoadAllOrderKey<T> = (
  collection: RepositoryCollections,
  key: string,
) => Maybe<T>;

type LoadByIdAndRelations<T> = (
  id: string,
  include: RepositoryCollections[],
) => Maybe<T>;

export interface Repository {
  loadOneByOrFail<T>(
    ...args: Parameters<LoadOneByOrFail<T>>
  ): ReturnType<LoadOneByOrFail<T>>;

  queryOn(...args: Parameters<QueryOn>): ReturnType<QueryOn>;
  createDocument(
    ...args: Parameters<CreateDocument>
  ): ReturnType<CreateDocument>;
  save(...args: Parameters<Save>): ReturnType<Save>;
  loadById<T>(...args: Parameters<LoadById<T>>): ReturnType<LoadById<T>>;
  loadAllOrderKey<T>(
    ...args: Parameters<LoadAllOrderKey<T>>
  ): ReturnType<LoadAllOrderKey<T>>;
  loadByIdAndRelations<T>(
    ...args: Parameters<LoadByIdAndRelations<T>>
  ): ReturnType<LoadByIdAndRelations<T>>;
}
