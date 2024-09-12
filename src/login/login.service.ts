import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  check(pass: string) {
    if (pass == process.env.ACCESS_KEY) {
      return true;
    }
    throw new BadRequestException();
  }
}
