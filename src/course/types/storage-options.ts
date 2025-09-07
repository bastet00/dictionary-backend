import { IDocumentSession } from 'ravendb';
import { Course } from '../dto/Course';

export interface StorageOpts {
  session: IDocumentSession;
  document: Course[keyof Course];
  seperation: boolean;
  collection: string;
}
