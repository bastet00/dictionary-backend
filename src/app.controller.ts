import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  transfer(
    @Query('ar') ar: string,
    @Query('hir') hir: string,
  ): Promise<object> {
    /**
     * @param ar - Arabic word to match ? @param hir - Hieroglyphic sound to match
     * @returns Promise contains the filtered documents
     *
     * Get only provided value then,
     * assign it to the same key in the document
     * Ex. {"ArabicName" || "EgyptionName" : value}
     */
    const provided = { ArabicName: ar, EgyptianName: hir };
    for (const [key, value] of Object.entries(provided)) {
      if (!value) {
        delete provided[key];
      }
      if (Object.keys(provided).length === 0) {
        throw new HttpException(
          'Empty queryies is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return this.appService.getTransfer(provided);
  }
}
