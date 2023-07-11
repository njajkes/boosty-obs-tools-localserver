import { Controller, Get, Post } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller('api/alert')
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Get()
  public async getSub() {
    return await this.alertService.getSub();
  }

  @Post()
  public debugSub() {
    return this.alertService.debugSub();
  }
}
