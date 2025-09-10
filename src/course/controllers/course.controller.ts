import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CourseService } from '../course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UserAnswerDto } from '../dto/user-answers.dto';
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
  getCourseByLevel(@Param('level') level: string) {
    return this.courseService.getCourseByLevel(level);
  }

  @Post(':id')
  checkUserAnswers(
    @Param('id') exerciseId: string,
    @Body() userAnswersDto: UserAnswerDto,
  ) {
    return this.courseService.checkUserAnswers(exerciseId, userAnswersDto);
  }
}
