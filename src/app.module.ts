import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RavendbService } from './raven/raven.service';
import { WordSuggestionModule } from './word-suggestion/word-suggestion.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    WordSuggestionModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService, RavendbService],
})
export class AppModule {}
