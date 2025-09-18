import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ExerciseService } from '../services/exercise.service';
import { CreateExerciseDto } from '../dto/create-exercise.dto';

@Controller('api/v1/exercise')
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @Post()
  createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exerciseService.createExercise(createExerciseDto);
  }

  @Patch()
  pushQuestionToExercise(
    @Query('exerciseTitle') eTitle: any,
    @Query('questionId') qid: string,
  ) {
    return this.exerciseService.pushQuestionToExercise(eTitle, qid);
  }

  @Get(':id')
  getExerciseById(@Param('id') id: string) {
    return this.exerciseService.getExerciseById(id);
  }
}
