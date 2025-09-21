import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Question, QuestionType } from '../db/documents/question.document';
import { Type, TypeHelpOptions } from 'class-transformer';
import { AnswersFactory, QuestionAnswers } from '../factory/factory';
import { UnprocessableEntityException } from '@nestjs/common';

export class CreateQuestionDto implements Question {
  id: string;
  created: Date;
  updated: Date;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  tags: string[];

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(QuestionType))
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  question: string;

  @Type((opts: TypeHelpOptions) => {
    try {
      const factory = AnswersFactory.getInstance();
      return factory.getAnswerClass(opts.object.type);
    } catch (error) {
      throw new UnprocessableEntityException(
        `Cannot process answers of type '${opts.object.type}'.`,
      );
    }
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  answer: QuestionAnswers[];
}
