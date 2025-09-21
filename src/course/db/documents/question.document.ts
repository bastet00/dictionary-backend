import { QuestionAnswers } from 'src/course/factory/factory';

export enum QuestionType {
  MCQ = 'mcq',
  SEQUENCE = 'sequence',
}
export interface Question {
  id: string;
  question: string;
  created: Date;
  updated: Date;
  tags: string[];
  type: QuestionType;
  answer: QuestionAnswers[];
}
