import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CounterController } from './counter.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [AuthModule, ScheduleModule.forRoot()],
  providers: [CounterService],
  controllers: [CounterController],
})
export class CounterModule {}
