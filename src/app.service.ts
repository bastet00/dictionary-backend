import { Injectable } from '@nestjs/common';
import { RavendbService } from './raven/raven.service';

type ProvidedQueryKey = {
  [key: string]: string;
};
@Injectable()
export class AppService {
  constructor(private readonly ravendbService: RavendbService) {}
  async getTransfer(obj: ProvidedQueryKey) {
    const key = Object.keys(obj)[0];
    const res = await this.ravendbService
      .session()
      .query({ collection: 'word' })
      .search(key, obj[key])
      .all();
    return res;
  }
}
