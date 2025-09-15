import { Injectable } from '@nestjs/common';
import { DataBaseRepository } from '../db/repository/course.repository';

@Injectable()
export class ExerciseService {
  constructor(private databaseRepo: DataBaseRepository) {}
}
