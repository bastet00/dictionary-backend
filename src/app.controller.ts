import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  /**
   * Health check endpoint
   * @returns Hello World
   */
  @Get()
  helloWorld() {
    return 'Hello World';
  }
}
