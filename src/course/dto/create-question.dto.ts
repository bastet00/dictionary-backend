import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Question } from '../db/documents/question.document';
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
  type: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @Type((opts: TypeHelpOptions) => {
    const factory = new AnswersFactory().initialize();
    const cast = factory.factorize(opts.object.type);
    if (cast instanceof Error) {
      throw new UnprocessableEntityException(
        `cannot process answers of type ${opts.object.type}`,
      );
    }
    return cast.constructor;
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  answer: QuestionAnswers[];
}
