// src/app.controller.ts
import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { AnalyzeRequestDto, AnalyzeResponseDto } from './dto/analysis.dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('analyze')
  @HttpCode(200)
  analyze(@Body() dto: AnalyzeRequestDto): AnalyzeResponseDto {
    console.log('Incoming request:', dto);
    return this.appService.analyze(dto);
  }
}