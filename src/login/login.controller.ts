import { Controller, Get, Query } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get()
  login(@Query('password') pass: string) {
    return this.loginService.check(pass);
  }
}
