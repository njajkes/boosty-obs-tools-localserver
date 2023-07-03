import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { AuthModule } from 'src/auth/auth.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [AuthModule, StorageModule],
  providers: [AlertService],
  controllers: [AlertController],
})
export class AlertModule {}
