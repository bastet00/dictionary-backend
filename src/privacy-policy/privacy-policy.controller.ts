import { Controller, Get } from '@nestjs/common';
import { privacyPolicyTextDiv } from './privacy-policy';

@Controller('privacy-policy')
export class PrivacyPolicyController {
  @Get()
  privacyPolicyHtml() {
    return {
      privacyPolicyTextDiv: privacyPolicyTextDiv.replace(/\n|\r/g, ''),
    };
  }
}
