import { Injectable } from '@nestjs/common';
import { RavendbService } from '../raven/raven.service';
import { LanguageEnum } from '../dto/language.enum';
import { Sentence } from 'src/raven/entities/sentence.entity';

@Injectable()
export class SentenceService {
  constructor(private readonly ravendbService: RavendbService) {}

  async vectorSimilaritySearch(
    lang: LanguageEnum = LanguageEnum.english,
    text: string,
  ): Promise<Sentence[]> {
    const sentences = await this.ravendbService.queryViaHttp<Sentence[]>(
      `from sentence where vector.search(embedding.text(${lang}), '${text}') limit 10`,
    );
    return sentences;
  }
}
