export type RepositoryCollections = 'course' | 'exercise' | 'question';

export interface IWhere {
  fieldName: string;
  value: any;
  allowWildcards?: boolean;
  nestedPath?: boolean;
  exact?: any;
}

export interface StorageOpts {
  document: any;
  collection: RepositoryCollections;
}

export type LoadOneByOrFail<T> = (opts: IWhere) => Promise<{
  result: Awaited<T>;
  founded: boolean;
}>;

type QueryOn = (collection: RepositoryCollections) => object;

type CreateDocument = (
  collection: RepositoryCollections,
  document: any,
) => Promise<{
  document: any;
  id: string;
}>;

type Save = () => Promise<void>;

export interface Repository {
  loadOneByOrFail<T>(
    ...args: Parameters<LoadOneByOrFail<T>>
  ): ReturnType<LoadOneByOrFail<T>>;

  queryOn(...args: Parameters<QueryOn>): ReturnType<QueryOn>;
  createDocument(
    ...args: Parameters<CreateDocument>
  ): ReturnType<CreateDocument>;
  save(...args: Parameters<Save>): ReturnType<Save>;
}
