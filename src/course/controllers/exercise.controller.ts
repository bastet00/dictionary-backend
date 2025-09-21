import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExerciseService } from '../services/exercise.service';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { LoginGuard } from '../../common/guards/login.guard';

@Controller('api/v1/exercise')
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @UseGuards(LoginGuard)
  @Post()
  createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exerciseService.createExercise(createExerciseDto);
  }

  @UseGuards(LoginGuard)
  @Patch()
  pushQuestionToExercise(
    @Query('exerciseId') exerciseId: string,
    @Query('questionId') qid: string,
  ) {
    return this.exerciseService.pushQuestionToExercise(exerciseId, qid);
  }

  @Get(':id')
  getExerciseById(@Param('id') id: string) {
    return this.exerciseService.getExerciseById(id);
  }
}
