import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RavenModule } from 'src/raven/raven.module';
import { McqModule } from './mcq/mcq.module';

@Module({
  imports: [
    { module: RavenModule, global: true },
    McqModule,
    RouterModule.register([{ path: 'api/quizz/', module: McqModule }]),
  ],
})
export class QuizzModule {}
