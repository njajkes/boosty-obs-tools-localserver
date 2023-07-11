import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { AuthModule } from 'src/auth/auth.module';
import { StorageModule } from 'src/storage/storage.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, StorageModule, ConfigModule],
  providers: [AlertService],
  controllers: [AlertController],
})
export class AlertModule {}
