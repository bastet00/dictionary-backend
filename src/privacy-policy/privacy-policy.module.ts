import { Module } from '@nestjs/common';
import { PrivacyPolicyController } from './privacy-policy.controller';

@Module({
  controllers: [PrivacyPolicyController],
})
export class PrivacyPolicyModule {}
