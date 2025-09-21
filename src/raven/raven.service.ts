import { Injectable } from '@nestjs/common';
import { DocumentStore } from 'ravendb';
import * as fs from 'fs';

export type DocumentName = 'word' | 'sentence' | 'word-suggestion' | 'Example';
@Injectable()
export class RavendbService {
  DB_NAME = 'words';
  private store: DocumentStore;

  constructor() {
    this.store = new DocumentStore(process.env.DB_URL, this.DB_NAME, {
      certificate: process.env.CERTIFICATE
        ? process.env.CERTIFICATE
        : fs.readFileSync(process.env.CERT_PATH),
      password: process.env.CERT_PASSWORD,
      type: process.env.CERTIFICATE ? 'pem' : 'pfx',
    });

    this.store.initialize();
  }

  session() {
    const session = this.store.openSession();
    return session;
  }

  async saveToDb(payload: object, docName: DocumentName) {
    const db = this.session();

    await db.store(
      { ...payload, '@metadata': { '@collection': docName } },
      crypto.randomUUID(),
      { documentType: docName },
    );

    await db.saveChanges();
  }
}
