import { Injectable, Scope } from '@nestjs/common';
import { RavendbService } from 'src/raven/raven.service';
import { IDocumentSession } from 'ravendb';
import { IWhere, Repository, RepositoryCollections } from './types';

// TODO: class functions is exposed and calling any function without withSession opens different session
// wrap it with A Repository class where it holds only withSession function
@Injectable({ scope: Scope.TRANSIENT })
export class DataBaseRepository {
  private _session: IDocumentSession;
  constructor(private ravenService: RavendbService) {}

  private getSession() {
    return this._session;
  }

  private setSession() {
    const session = this.ravenService.session();
    this._session = session;
  }
  private freeSession() {
    this._session = null;
  }

  /**
   * creates a proxy layer between this class and any following function call to the class itself
   * the proxy layer injects the session or create a new session then inject it using
   * set , get session
   * this helps to keep the same unit of work(session) per each withSession function call until calling save()
   
   * @returns: same class with proxy layer that injects session to any method receive and operate on session
   * 
   * */
  withSession(): Omit<Repository, 'withSession'> {
    if (!this.getSession()) {
      this.setSession();
    }
    /* eslint-disable @typescript-eslint/no-this-alias */
    const self = this;

    const proxy = new Proxy(this, {
      get(target, prop, receiver) {
        const orig = Reflect.get(target, prop, receiver);

        return (...args: any[]) => {
          if (typeof orig === 'function') {
            const expectsSession = orig.length > args.length;
            if (expectsSession) {
              args.push(self.getSession());
            }
            return orig.apply(proxy, args);
          }
          return orig;
        };
      },
    });

    return proxy;
  }

  queryOn(collection: RepositoryCollections, session?: IDocumentSession) {
    return session.query({ collection });
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async loadOneByOrFail<T>(opts: IWhere, session?: IDocumentSession) {
    return this.maybeFail(async () => {
      return this.queryOn('course')
        .whereEquals(opts.fieldName, opts.value)
        .single() as Promise<T>;
    });
  }

  async createDocument(
    collection: RepositoryCollections,
    document: any,
    session?: IDocumentSession,
  ) {
    const setup = (obj: any) => {
      return { ...obj, '@metadata': { '@collection': collection } };
    };
    const id = crypto.randomUUID();

    await session.store(setup(document), id);
    return { ...document, id };
  }

  private async maybeFail<T>(action: () => Promise<T>) {
    const maybe = {} as { result: any; founded: boolean };
    try {
      maybe.result = (await action()) as T;
      maybe.founded = true;
    } catch {
      maybe.result = null;
      maybe.founded = false;
    } finally {
      return maybe;
    }
  }

  async save(session?: IDocumentSession) {
    session.saveChanges();
    this.freeSession();
  }
}
