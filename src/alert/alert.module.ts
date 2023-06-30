import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';

@Module({
  providers: [AlertService],
  controllers: [AlertController]
})
export class AlertModule {}
