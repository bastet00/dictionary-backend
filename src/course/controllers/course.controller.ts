import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CourseService } from '../services/course.service';
import { CreateCourseDto } from '../dto/create-course.dto';

@Controller('api/v1/course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // @UseGuards(LoginGuard)
  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Get(':level')
  getCourse(@Param('level') level: string) {
    return this.courseService.getCourse(level);
  }
}
