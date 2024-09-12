import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  check(pass: string) {
    return true ? pass === process.env.ACCESS_KEY : false;
  }
}
