import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RavendbService } from './raven/raven.service';
import { WordSuggestionModule } from './word-suggestion/word-suggestion.module';
import { LoginModule } from './login/login.module';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';
import { AdminModule } from './admin/admin.module';
import { WordModule } from './word/word.module';
import { AppController } from './app.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1000 * 1,
        limit: 5,
      },
    ]),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    WordSuggestionModule,
    LoginModule,
    PrivacyPolicyModule,
    AdminModule,
    WordModule,
  ],
  providers: [
    RavendbService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
