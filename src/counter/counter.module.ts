import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CounterController } from './counter.controller';

@Module({
  providers: [CounterService],
  controllers: [CounterController]
})
export class CounterModule {}
