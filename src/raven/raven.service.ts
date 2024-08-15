import { Injectable } from '@nestjs/common';
import { DocumentStore } from 'ravendb';
import * as fs from 'fs';

@Injectable()
export class RavendbService {
  private store: DocumentStore;

  constructor() {
    this.store = new DocumentStore(process.env.DB_URL, 'words', {
      certificate: fs.readFileSync(process.env.CERT_PATH),
      password: process.env.CERT_PASSWORD,
      type: 'pfx',
    });
    this.store.initialize();
  }

  session() {
    const session = this.store.openSession();
    return session;
  }
}
