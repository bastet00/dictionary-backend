import { QuestionAnswers } from 'src/course/factory/factory';

export interface Question {
  id: string;
  question: string;
  created: Date;
  updated: Date;
  tags: string[];
  type: string;
  answer: QuestionAnswers[];
}
