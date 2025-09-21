import { SequenceAnswers } from './sequence-answers.factory';
import { McqAnswers } from './mcq-answers.factory';
import { QuestionType } from '../db/documents/question.document';

export type QuestionAnswers = SequenceAnswers | McqAnswers;

/**
 * Handles:
 * - cast each exercise type to its appropriate class dto so class validator
 * process the nested objects with right validators despite different keys
 *
 * - processing different exercise documents from the database checking its
 *   class and answer correctness
 * */
export class AnswersFactory {
  private static instance: AnswersFactory;
  private registers: Map<string, new () => QuestionAnswers>;

  private constructor() {
    this.registers = new Map();
    this.initialize();
  }

  static getInstance(): AnswersFactory {
    if (!AnswersFactory.instance) {
      AnswersFactory.instance = new AnswersFactory();
    }
    return AnswersFactory.instance;
  }

  private initialize() {
    this.registers.set(QuestionType.MCQ, McqAnswers);
    this.registers.set(QuestionType.SEQUENCE, SequenceAnswers);
  }

  getAnswerClass(type: string): new () => QuestionAnswers {
    const AnswerClass = this.registers.get(type);
    if (!AnswerClass) {
      throw new Error(`Unknown answer type: ${type}`);
    }
    return AnswerClass;
  }
}
