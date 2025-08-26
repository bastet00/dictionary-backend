import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMcqDto, McqAnswer, McqDto } from '../dto/create-question.dto';
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

  resultChain(value: Partial<McqDto>, failback) {
    // TODO: use T for typing inhancment

    // const self = this // hold higher level this for infinite chains

    return {
      value: value,
      fallback: {},
      bind: function (func: (obj: McqDto) => McqAnswer) {
        if (!this.value) {
          // console.log('no object at chain, previous chain fails');
          this.failback = failback();
          return { result: this.failback, fail: true };
        }
        return { result: func(this.value), fail: false };
      },
    };
  }

  questionOrAnswerNotFound() {
    return {
      question: '',
      questionId: -1,
      correct: false,
      rightAnswer: -1,
      userAnswer: -1,
    };
  }

  async checkQuizzAnswers(userAnswersDto: UserAnswersDto, quizzId: string) {
    const result = [];
    const submittion = userAnswersDto.answers;
    const quizzEntity = await this.getQuizzByID(quizzId);
    let score = 0;

    submittion.map((userSumbittion) => {
      const questionDoc = quizzEntity.quizz.find(
        (obj) => obj.qId === userSumbittion.questionId,
      );
      const rc = this.resultChain(
        questionDoc,
        this.questionOrAnswerNotFound,
      ).bind((value: McqDto) => value.answers.find((obj) => obj.isAnswer));

      if (!rc.fail && rc.result.aId === userSumbittion.answerId) {
        score++;
      }

      if (rc.fail) {
        result.push(rc.result);
      } else {
        result.push({
          question: questionDoc.question,
          userAnswer: userSumbittion.answerId,
          qId: questionDoc.qId,
          correct: rc.result.aId === userSumbittion.answerId,
          rightAnswer: rc.result.aId,
        });
      }
    });
    return {
      result: result,
      score: (score / quizzEntity.quizz.length) * 100,
    };
  }
}
