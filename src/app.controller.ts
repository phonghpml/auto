import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('run')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  runAuto() {
    return this.appService.runAuto();
  }
}
