import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DocumentStore } from 'ravendb';
import * as fs from 'fs';
import { firstValueFrom } from 'rxjs';
import * as https from 'https';
import { randomUUID } from 'crypto';

export type DocumentName = 'word' | 'sentence' | 'word-suggestion' | 'Example';
@Injectable()
export class RavendbService {
  DB_NAME = 'words';
  private store: DocumentStore;
  agent: https.Agent;

  constructor(private readonly httpService: HttpService) {
    this.agent = new https.Agent({
      cert: process.env.CERTIFICATE_WITHOUT_PASSWORD,
      key: process.env.CERTIFICATE_RSA_PRIVATE_KEY,
    });
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
      randomUUID(),
      { documentType: docName },
    );

    await db.saveChanges();
  }

  async queryViaHttp<T>(query: string): Promise<T> {
    const url = `${process.env.DB_URL}/databases/${this.DB_NAME}/queries`;
    const response = await firstValueFrom(
      this.httpService.post<{ Results: T }>(
        url,
        { Query: query },

        {
          httpsAgent: this.agent,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    return response.data.Results;
  }
}
