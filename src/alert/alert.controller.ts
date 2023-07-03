import { Controller, Get } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller('alert')
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Get()
  public async getSub() {
    return await this.alertService.getSub();
  }
}
