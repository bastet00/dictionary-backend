export interface Question {
  question: string;
  created: Date;
  updated: Date;
  tags: string[];
  type: string;
  answer: any[];
}
