import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    const session = this.ravendbService.session();
    try {
      const sentences = await session
        .query<Sentence>({ collection: 'sentence' })
        .vectorSearch(
          (field) => field.withText(`${lang}`),
          (factory) => factory.byText(text),
          {
            similarity: 0.8,
            numberOfCandidates: 100,
          },
        )
        .take(10)
        .all();

      return sentences;
    } catch (error) {
      console.error('Vector search failed:', error);
      throw new InternalServerErrorException('Search failed');
    } finally {
      session.dispose();
    }
  }
}
