import { Controller, Get } from '@nestjs/common';
import { count } from './counter.service';

@Controller('counter')
export class CounterController {
  @Get()
  getCounter() {
    return { count };
  }
}
