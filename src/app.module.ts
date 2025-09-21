import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WordSuggestionModule } from './word-suggestion/word-suggestion.module';
import { LoginModule } from './login/login.module';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';
import { AdminModule } from './admin/admin.module';
import { WordModule } from './word/word.module';
import { AppController } from './app.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LiteralTranslationModule } from './literal-translation/literal-translation.module';
import { TranslationModule } from './translation/translation.module';
import { CategoryModule } from './category/category.module';
import { CourseModule } from './course/course.module';

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
    LiteralTranslationModule,
    TranslationModule,
    CategoryModule,
    CourseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
