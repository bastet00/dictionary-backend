import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMcqDto } from '../dto/create-question.dto';
import { RavendbService } from '../../raven/raven.service';
import { QuizzFilters } from '../dto/quizz-types.dto';
import { McqEntity } from '../entities/mcq.entity';
import { UserAnswersDto } from '../dto/check-quizz.dto';

@Injectable()
export class McqService {
  constructor(private ravenService: RavendbService) {}
  async createQuestion(createMcqDto: CreateMcqDto) {
    let incQuesId = 1;
    let incAnswerId = 1;
    createMcqDto.quizz.map((obj) => {
      obj.qId = incQuesId;
      obj.answers.map((obj) => {
        obj.aId = incAnswerId;
        incAnswerId++;
      });
      incQuesId++;
    });

    return await this.ravenService.saveToDb(createMcqDto, 'quizz');
  }

  async getQuizz(opts: QuizzFilters) {
    try {
      const session = this.ravenService.session();

      const quizz = await session
        .query<McqEntity>({ collection: 'quizz' })
        .whereEquals('info.section', opts.section)
        .whereEquals('info.level', opts.lvl)
        .whereEquals('type', opts.type)
        .all();
      return this.toDto(quizz[0]);
    } catch {
      throw new NotFoundException('cannot find quizz');
    }
  }

  private toDto(mcq: McqEntity) {
    return {
      id: mcq.id,
      mcq: mcq.quizz.map((mcq) => {
        return {
          question: mcq.question,
          answers: mcq.answers.map((obj) => ({
            answer: obj.answer,
            aid: obj.aId,
          })),
          qid: mcq.qId,
        };
      }),
      type: mcq.type,
      name: mcq.lessonName,
      info: mcq.info,
    };
  }

  async getQuizzByID(id: string) {
    const quizz = await this.ravenService
      .session()
      .query({ collection: 'quizz' })
      .whereEquals('id', id)
      .all();

    if (quizz.length === 0) {
      throw new NotFoundException('Invalid quizz id');
    }
    return quizz[0] as McqEntity;
  }
  async checkQuizzAnswers(userAnswersDto: UserAnswersDto, quizzId: string) {
    let score = 0;
    const result = [];
    const submittion = userAnswersDto.answers;
    const quizzEntity = await this.getQuizzByID(quizzId);
    console.log('Querying for quizz id: ', quizzId);

    submittion.map((userSumbittion) => {
      const originalDoc = quizzEntity.quizz.find(
        (obj) => obj.qId === userSumbittion.questionId,
      );
      console.log(originalDoc);

      const checkAnswer = originalDoc.answers.find(
        (answer) => answer.aId === userSumbittion.answerId,
      );

      if (checkAnswer && checkAnswer.isAnswer) {
        score++;
      }

      result.push({
        question: originalDoc.question,
        userAnswer: userSumbittion.questionId,
        correct: checkAnswer.isAnswer,
      });
    });

    return {
      result: result,
      score: score,
    };
  }
}
