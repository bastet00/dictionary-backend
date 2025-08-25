export enum QuestionTypesEnum {
  MCQ = 'mcq',
  SEQ = 'sequense',
}

export interface QuizzFilters {
  lvl: number;
  section: number;
  type: QuestionTypesEnum;
}
