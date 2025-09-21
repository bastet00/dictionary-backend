export abstract class AnswersABC {
  typeName(): string {
    throw new Error('Method "typeName" must be implemented by subclasses.');
  }

  abstract aid: number;
}
