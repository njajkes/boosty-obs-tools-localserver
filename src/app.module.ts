import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AlertModule } from './alert/alert.module';
import { CounterModule } from './counter/counter.module';

@Module({
  imports: [AuthModule, AlertModule, CounterModule],
  providers: [],
})
export class AppModule {}
