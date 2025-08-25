import { CreateMcqDto } from '../dto/create-question.dto';

export class McqEntity extends CreateMcqDto {
  id: string;
  '@metadata': string;
}
