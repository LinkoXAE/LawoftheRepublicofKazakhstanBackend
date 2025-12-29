import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) return [];
    return this.appService.search(query);
  }

  @Get('document')
  async getDocument(@Query('url') url: string) {
    if (!url) throw new BadRequestException('URL is required');
    return this.appService.getDocumentContent(url);
  }
}