import { Controller, Get } from '@nestjs/common';
import { CounterService } from './counter.service';

@Controller('api/counter')
export class CounterController {
  constructor(private counterService: CounterService) {}

  @Get()
  getCounter() {
    return this.counterService.getCounter();
  }
}
