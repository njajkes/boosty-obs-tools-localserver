import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CounterController } from './counter.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StorageModule } from 'src/storage/storage.module';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [AuthModule, ScheduleModule.forRoot(), StorageModule],
  providers: [CounterService, StorageService],
  controllers: [CounterController],
})
export class CounterModule {}
