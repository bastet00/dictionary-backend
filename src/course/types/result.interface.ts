export interface Result {
  qid: number;
  question: string;
  userAnswer: number | number[];
  isCorrect: boolean;
}
