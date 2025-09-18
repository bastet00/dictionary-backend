export abstract class AnswersABC {
  typeName(): string {
    throw new Error('Method "typeName" must be implemented by subclasses.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // correctnessByType(document: any, userAnswer: UserAnswerDto): Result {
  //   throw new Error(
  //     'Method "correctnessByType" must be implemented by subclasses.',
  //   );
  // }

  abstract aid: number;
}
