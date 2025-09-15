export abstract class AnswersABC {
  typeName(): string {
    throw new Error('Method "typeName" must be implemented by subclasses.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  abstract aid: number;
}
