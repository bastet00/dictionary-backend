import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from '../services/course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { PatchUnitExerciseDto } from '../dto/patch-unit-exercise.dto';
import { LoginGuard } from '../../common/guards/login.guard';

@Controller('api/v1/course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(LoginGuard)
  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Get(':level')
  getCourse(@Param('level') level: string) {
    return this.courseService.getCourse(level);
  }

  @UseGuards(LoginGuard)
  @Patch()
  patchUnitExercise(@Body() patchUnitExercise: PatchUnitExerciseDto) {
    return this.courseService.patchUnitExercise(patchUnitExercise);
  }
}
