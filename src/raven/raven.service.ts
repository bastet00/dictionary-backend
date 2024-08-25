import { Injectable } from '@nestjs/common';
import { DocumentStore } from 'ravendb';
import * as fs from 'fs';

@Injectable()
export class RavendbService {
  private store: DocumentStore;

  constructor() {
    this.store = new DocumentStore(process.env.DB_URL, 'words', {
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

  async saveToDb(payload: object, docName: string) {
    const db = this.session();

    await db.store(
      { ...payload, '@metadata': { '@collection': docName } },
      crypto.randomUUID(),
      { documentType: docName },
    );

    await db.saveChanges();
  }
}
