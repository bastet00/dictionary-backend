import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RavendbService } from './raven/raven.service';
import { WordSuggestionModule } from './word-suggestion/word-suggestion.module';
import { LoginModule } from './login/login.module';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';
import { AdminModule } from './admin/admin.module';
import { WordModule } from './word/word.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    WordSuggestionModule,
    LoginModule,
    PrivacyPolicyModule,
    AdminModule,
    WordModule,
  ],
  providers: [RavendbService],
  controllers: [AppController],
})
export class AppModule {}
