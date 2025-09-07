import { SequenceAnswers } from './sequence-answers.factory';
import { McqAnswers } from './mcq-answers.factory';
import { AnswersABC } from './answers.abs';
import { BadRequestException } from '@nestjs/common';
import { ExerciseDto } from '../dto/create-course.dto';
import { UserAnswerDto } from '../dto/user-answers.dto';

export type ExerciseTypes = SequenceAnswers | McqAnswers;

type Registers = { name: string; of: ExerciseTypes };

/**
 * Handles:
 * - cast each exercise type to its appropiate class dto so class validator
 * process the nested objects with right validators despite different keys
 *
 * - processing different exercise documents from the database checking its
 *   class and answer correctness
 * */
export class AnswersFactory {
  registers: Registers[];

  constructor(args?: Registers[]) {
    this.registers = args || [];
  }

  initialize() {
    const mcq = new McqAnswers();
    const seq = new SequenceAnswers();
    this.registers.push({
      name: mcq.typeName(),
      of: mcq,
    });
    this.registers.push({
      name: seq.typeName(),
      of: seq,
    });

    return new AnswersFactory(this.registers);
  }

  factorize(type: string) {
    for (const register of this.registers) {
      if (register.name === type) return register.of;
    }
    return new Error();
  }

  check(exercise: ExerciseDto, userAnswer: UserAnswerDto) {
    const register = this.factorize(exercise.type);
    if (register instanceof Error) {
      throw new BadRequestException('invalid type');
    }

    return register.correctnessByType(exercise, userAnswer);
  }
}
